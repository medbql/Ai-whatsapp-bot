import { makeWASocket, useMultiFileAuthState, type WASocket, type ConnectionState } from '@whiskeysockets/baileys';
import { sendQrCode, sessionStatus } from "./server.ts"
import { logs } from "./utils/logs.ts";
import { Wnums } from './db/connection.ts';

const activeSessions = new Map<string, WASocket>();

//get to know if is request 
var initialRequest: boolean = false;


export function startSession(sessionId: string): Promise<string | number> {
  return new Promise(async (resolve, reject) => {
    try {

      if (sessionId) {

        const { state, saveCreds } = await useMultiFileAuthState(`auth/${sessionId}`);
        const sock: WASocket = makeWASocket({
          auth: state,
          printQRInTerminal: false
        })

        activeSessions.set(sessionId, sock);

        sock.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
          const { connection, qr, lastDisconnect } = update;
          logs('------------------------------------------------------- \n');
          logs(`Connection status: ${connection}  \n`);
          logs('------------------------------------------------------- \n');

          //if new session we have a new qr code 
          qr && (
            resolve(qr),
            initialRequest && sendQrCode(qr, sessionId),
            initialRequest = true
          )

          //when the connection status is close 
          connection === "close" && (
            (lastDisconnect?.error as any)?.output?.statusCode === 515 && startSession(sessionId)
          )

          //when the connection status is open 
          connection === 'open' && sessionStatus(true, sessionId)
        })

        sock.ev.on('creds.update', saveCreds);
      }

    } catch (error) {
      reject(error);
    }
  })
}

export function startBotLogic(sessionId: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const sock = activeSessions.get(sessionId);

      if (!sock) {

        logs(`❌ No socket found for session: ${sessionId}`);
        reject(false)
      } else {

        logs(`🤖 Starting bot logic for session: ${sessionId}`);

        sock.ev.on('messages.upsert', async ({ messages, type }) => {
          try {
            const message = messages?.[0];

            if (!message || !message.key) {
              return;
            }

            //check if the from my self and if yes set true
            const isFromMe = message.key?.fromMe ?? true;

            if (!isFromMe && type === 'notify') {
              //response message
              const getMessage = message.message?.conversation;
            }
          } catch (errMessage) {
            logs(`Error message proccess in session: ${sessionId}, ${errMessage}`);
          }
        })

        resolve(true)
      }
    } catch (err) {
      logs(err)
      reject(false)
    }

  })
}
