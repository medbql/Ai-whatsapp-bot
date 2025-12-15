//import modules
import Express from "express";
import { startBotLogic, startSession } from "./bot.ts";
import fs from 'fs/promises';
import wss, { WebSocketServer } from "ws";
import http from "http";
import psql from "./db/connection.ts";
import { error } from "console";


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



export const sessionStatus = async (status: boolean, sessionId: string): Promise<void> => {
  const client = clients.get(sessionId);

  (status && client?.readyState === wss.OPEN) && (
    await psql.query('UPDATE WhatsappNums SET linked = TRUE WHERE number =$1', [sessionId]).then(
      (value) => console.log(value)
    ),
    client.send(JSON.stringify({ status: 'open' }))
  )

}

app.post('/linkDevice', async (req, res) => {
  console.log('Get requeste...')

  //get the sessionid by destructing from req body
  const { sessionId } = req.body;
  console.log(sessionId)
  let response: any;//instialze the response

  //get the linked session stored in auth directorie
  const sesionId_Dir: readonly String[] = await fs.readdir('./auth');
  console.log(sessionId)
  //when the number alerady have one session linked don't linked second one
  if (!sesionId_Dir.includes(sessionId)) {

    await startSession(sessionId).then(
      (res => response = { QrCode: res })
    ).catch(err => response = { error: err })
    console.log(response)
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

  await psql.query(`INSERT INTO WhatsappNums (number,user_id) VALUES ($1,$2) `, [number, user_id]).then(
    (val) => {
      res.status(201).json({ message: "insert successfly." })
    }
  )
})

app.get('/numbers/:user_id', async (req, res) => {

  const user_id: number = parseInt(req.params.user_id);
  await psql.query('SELECT * FROM WhatsappNums WHERE user_id= $1', [user_id]).then(
    (data) => {
      res.status(201).json({ data: data.rows })
    }
  )

})

//---------------Boots api-----------------------------//
//----------------------------------------------------//
app.get('/boots/:user_id', async (req, res) => {
  const user_id: number = parseInt(req.params.user_id);
  await psql.query(`SELECT B.name, B.model, W.number  FROM Boots AS B
                    INNER JOIN WhatsappNums AS W ON B.number_id = W.id 
                    WHERE W.user_id= $1`, [user_id])
    .then(
      (data) => {
        res.status(201).json({ data: data.rows })
      }
    )

})

app.post('/boot', async (req, res) => {

  const { botName, botModel, number_id } = req.body;
  await psql.query('INSERT INTO Boots (name,model,number_id) VALUES($1,$2,$3)',
    [botName, botModel, parseInt(number_id)]
  ).then((val) => res.status(201).json({ message: "insert successfly." })
  )

})













server.listen(port, () => { console.log('Start the server.......') })
