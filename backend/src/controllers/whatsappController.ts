import { type Request, type Response } from "express";
import fs from 'fs/promises';
import { startBotLogic, startSession } from "../services/bot.js";
import wss, { WebSocketServer } from "ws";
import { Server } from "http";
import { logs } from "../utils/logs.js";
import { Wnums } from "../db/connection.js";


/*
 * get the Qr Code to link the session
 */
async function QrCode(req: Request, res: Response): Promise<void> {
  try {
    //get the sessionid
    if (req.params.session_id) {

      const sessionId: string = req.params.session_id as string;
      const sendSession = async (files: string[]): Promise<void> => {
        //get the linked session stored in auth directorie
        const sesionId_Dir: readonly string[] = files;
        //when the number alerady have one session linked don't linked second one
        if (!sesionId_Dir.includes(sessionId)) {

          await startSession(sessionId).then(
            (qr) => res.status(201).json({
              QrCode: qr
            })
          )
        } else { res.status(400).json({ message: "this session alerady exist." }) }


      }

      await fs.readdir('./auth').then(files => sendSession(files)
      ).catch(async (err) => {
        await fs.mkdir('auth');
        const sesionId_Dir: string[] = await fs.readdir('./auth');
        sendSession(sesionId_Dir)
      })
    }
  } catch (error) {
    res.status(500).json({
      message: 'server error',
      error: error
    })
  }
}

/*
 * start bot whatsapp
 */
async function start(req: Request, res: Response): Promise<void> {
  try {
    const { sessionId } = req.body;
    const sesionId_Dir: readonly String[] = await fs.readdir('./auth');

    if (sesionId_Dir.includes(sessionId)) {
      await startBotLogic(sessionId).then(
        (value) => value ? res.status(201).json({ message: 'bot start' })
          : res.json({ error: value })
      )
    }

  } catch (error) {
    res.status(500).json({
      message: 'server error',
      error: error
    })

  }
}

//store the clients in a map 
const clients = new Map<string, wss>();


/*
 * Web sockect Connection
 */
function setupWebSockect(server: Server) {
  //create webSocket server
  const socket = new WebSocketServer({ server });

  //handel connection event
  socket.on('connection', (ws) => {
    logs(`client connected`);

    //recive message
    ws.on('message', (ms) => {
      try {
        const data = JSON.parse(ms.toString());

        !clients.has(data.sessionId) && clients.set(data.sessionId, ws);
      } catch (error) {
        logs(error)
      }
    })

    ws.on('close', () => {
      logs('the channel close');
      clients.forEach((wss, sessionId) => {
        wss === ws && clients.delete(sessionId)
      })
    })
  })
}

//send the QrCode by webSockect channel
export const sendQrCode = (qr: string, clientId: string): void => {
  const data = {
    status: 'notStarted',
    qr
  }
  //get the clinet from clients stored
  const client = clients.get(clientId);

  //check if client here && and connection status     
  client?.readyState === wss.OPEN && (
    console.log('send qr'),
    client.send(JSON.stringify(data))
  )

}

//update the status of session
const linkedSession = async (sessionId: string): Promise<void> => {
  const dataUpdated = { linked: true };
  await Wnums.UpdateNum(sessionId, dataUpdated)
}

export const sessionStatus = async (status: boolean, sessionId: string): Promise<void> => {
  const client = clients.get(sessionId);

  (status && client?.readyState === wss.OPEN) && (
    await linkedSession(sessionId),
    client.send(JSON.stringify({ status: 'open' }))
  )

}

export { QrCode, start, setupWebSockect }
