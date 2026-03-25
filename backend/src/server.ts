//import modules
import Express, { type Application, type NextFunction } from "express";
import { logs } from "./utils/logs.js";
import { authRouter } from "./routes/auth.js";
import { numbersRouter } from "./routes/numbers.js";
import { bootsRouter } from "./routes/boots.js";
import { whatsappRouter } from "./routes/whatsapp.js";
import { setupWebSockect } from "./controllers/whatsappController.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app: Application = Express();
const port: Number = 8080;

const frontend_url = process.env.FRONTEND_URL;


app.use(Express.json())
app.use(Express.urlencoded())
app.use(cookieParser())

// Manual CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', frontend_url); // Allow all origins

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Expose-Headers', 'X-New-Access-Token'); // ✅ Fixed!
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});


//routes
app.use('/api/auth', authRouter)
app.use('/api/numbers', authMiddleware, numbersRouter)
app.use('/api/boots', authMiddleware, bootsRouter)
app.use('/api/whatsapp', authMiddleware, whatsappRouter)





const server = app.listen(port, () => { logs('Start the server.......') })

//setUp webSockect
setupWebSockect(server)








