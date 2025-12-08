import { makeWASocket, useMultiFileAuthState } from '@whiskeysockets/baileys';

export function startSession() {

  return new Promise(async (resolve, reject) => {
    try {

      const { state, saveCreds } = await useMultiFileAuthState('auth/user7');
      const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
      })


      sock.ev.on('connection.update', (update) => {
        const { connection, qr } = update;
        qr ? resolve(qr)
          : connection === 'open' && resolve(200)
      })

      sock.ev.on('creds.update', saveCreds);

    } catch (error) {
      reject(error);
    }
  })
}


