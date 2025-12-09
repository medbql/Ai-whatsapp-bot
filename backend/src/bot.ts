import { makeWASocket, useMultiFileAuthState, DisconnectReason, type WASocket, type ConnectionState } from '@whiskeysockets/baileys';

export function startSession(): Promise<string | number> {

  return new Promise(async (resolve, reject) => {
    try {

      const { state, saveCreds } = await useMultiFileAuthState('auth/user7');
      const sock: WASocket = makeWASocket({
        auth: state,
        printQRInTerminal: false
      })


      sock.ev.on('connection.update', async (update: Partial<ConnectionState>) => {
        const { connection, qr, lastDisconnect } = update;
        console.log('------------------------------------------------------- \n');
        console.log("Connection status:", connection, "\n");
        console.log('------------------------------------------------------- \n');
        //if new session we have a new qr code 
        qr && resolve(qr)

        //when the connection status is close 
        connection === "close" && (
          (lastDisconnect?.error as any)?.output?.statusCode === 515 && startSession()
        )

        //when the connection status is open 
        connection === 'open' && resolve(200)
      })

      sock.ev.on('creds.update', saveCreds);

    } catch (error) {
      reject(error);
    }
  })
}


