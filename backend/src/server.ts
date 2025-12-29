//import modules
import Express from "express";
import { startBotLogic, startSession } from "./bot.ts";
import fs from 'fs/promises';
import wss, { WebSocketServer } from "ws";
import { Boot, Wnums } from "./db/connection.ts";
import { logs } from "./utils/logs.ts";
import { stringify } from "querystring";



const app = Express();
const port: Number = 8080;


app.use(Express.json())

// Manual CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow all origins

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});



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

    res.status(201).json({ response })

  } else { res.status(200).json({ message: "this session alerady exist." }) }

})

app.post('/startBoot', async (req, res) => {
  const { sessionId } = req.body;
  const sesionId_Dir: readonly String[] = await fs.readdir('./auth');
  if (sesionId_Dir.includes(sessionId)) {
    await startBotLogic(sessionId).then(
      (value) => value ? res.status(201).json({ message: 'bot start' })
        : res.json({ error: value })
    )
  }
})


//---------------Numbers phone api--------------------//
//----------------------------------------------------//

app.post('/addNUmber', async (req, res) => {
  const { number, user_id } = req.body;

  await Wnums.Insert({ number, user_id }).then(
    (val) => {
      res.status(201).json({ message: "insert successfly." })
    }
  )
})

app.get('/numbers/:user_id', async (req, res) => {

  const user_id: number = parseInt(req.params.user_id);
  await Wnums.UsersNums(user_id).then(
    (data) => {
      res.status(201).json({ data: data })
    }
  )

})

//---------------Boots api-----------------------------//
//----------------------------------------------------//
app.get('/boots/:user_id', async (req, res) => {
  const user_id: number = parseInt(req.params.user_id);
  await Boot.Nums_Join(user_id).then(
    (data) => {
      res.status(201).json({ data: data.rows })
    }
  )

})

app.post('/boot', async (req, res) => {

  const { botName, botModel, number_id } = req.body;
  await Boot.Insert({ name: botName, model: botModel, number_id }).then((val) => res.status(201).json({ message: "insert successfly." })
  )

})




const server = app.listen(port, () => { logs('Start the server.......') })

//-----------------------------------------------------//
//--------Handel webSockect connections----------------//
//----------------------------------------------------//

//create webSocket server
const socket = new WebSocketServer({ server });

//store the clients in a map 
const clients = new Map<string, wss>();

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








