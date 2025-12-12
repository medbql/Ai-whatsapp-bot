//import modules
import Express from "express";
import { startSession } from "./bot.ts";
import fs from 'fs/promises';
import wss, { WebSocketServer } from "ws";
import http from "http";
import { log } from "console";


const app = Express();
const port: Number = 8080;

const server = http.createServer(app);

//open  channel
const socket = new WebSocketServer({ server });

app.use(Express.json())
// Manual CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow all origins

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});

const clients = new Map<string, wss>();

socket.on('connection', (ws) => {
  console.log('start channel');

  ws.on('message', (ms) => {
    console.log('message to channel')
    try {
      const data = JSON.parse(ms.toString());

      !clients.has(data.sessionId) && clients.set(data.sessionId, ws);
    } catch (error) {
      console.log(error)
    }
  })

  ws.on('close', () => {
    console.log('the channel close');
    clients.forEach((wss, sessionId) => {
      wss === ws && clients.delete(sessionId)
    })
  })

})



export const sessionStatus = (status: boolean, sessionId: string): void => {
  const client = clients.get(sessionId);

  (status && client?.readyState === wss.OPEN) && client.send(JSON.stringify({ status: 'open' }))

}

app.post('/linkDevice', async (req, res) => {
  console.log('Get requeste...')

  //get the sessionid by destructing from req body
  const { sessionId } = req.body;

  let response: any;//instialze the response

  //get the linked session stored in auth directorie
  const sesionId_Dir: readonly String[] = await fs.readdir('./auth');

  //when the number alerady have one session linked don't linked second one
  if (!sesionId_Dir.includes(sessionId)) {

    await startSession(sessionId).then(
      (res => response = { QrCode: res })
    ).catch(err => response = { error: err })
    console.log(response)
    res.status(201).json({ response })

  } else { res.status(200).json({ message: "this session alerady exist." }) }

})


server.listen(port, () => { console.log('Start the server.......') })
