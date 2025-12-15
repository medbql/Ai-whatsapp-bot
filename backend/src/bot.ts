import { makeWASocket, useMultiFileAuthState, type WASocket, type ConnectionState } from '@whiskeysockets/baileys';
import { sessionStatus } from "./server.ts"

const activeSessions = new Map<string, WASocket>();

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
          console.log('------------------------------------------------------- \n');
          console.log("Connection status:", connection, "\n");
          console.log('------------------------------------------------------- \n');
          //if new session we have a new qr code 
          qr && (resolve(qr))

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

export function startBotLogic(sessionId: string): Promise<Boolean> {
  return new Promise(async (resolve, reject) => {
    try {
      const sock = activeSessions.get(sessionId);

      if (!sock) {
        console.log(`❌ No socket found for session: ${sessionId}`);
        reject(false)
      } else {

        console.log(`🤖 Starting bot logic for session: ${sessionId}`);

        // ✅ NOW listen for messages
        sock.ev.on('messages.upsert', async (m) => {
          console.log('📩 New message received:', m);

          // Your bot logic here
          const message = m.messages[0] || '';
          if ((message && !message.key.fromMe) && m.type === 'notify') {
            console.log(message)
          }
        });
        resolve(true)
      }
    } catch (err) {
      reject(err)
    }

  })
}
