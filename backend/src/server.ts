//import modules
import Express from "express";
import { startSession } from "./bot.ts";


const app = Express();
const port: Number = 8080;

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

app.post('/linkDevice', async (req, res) => {
  console.log('Get requeste...')
  const { sessionName } = req.body;

  let code: any;
  await startSession(sessionName).then((res => code = res))
    .catch(err => code = err)

  res.status(200).json({ code })

})

app.listen(port, () => { console.log('Start the server.......') })
