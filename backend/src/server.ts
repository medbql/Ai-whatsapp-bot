//import modules
import Express, { type Application, type NextFunction } from "express";
import { logs } from "./utils/logs.ts";
import { authRouter } from "./routes/auth.ts";
import { numbersRouter } from "./routes/numbers.ts";
import { bootsRouter } from "./routes/boots.ts";
import { whatsappRouter } from "./routes/whatsapp.ts";
import { setupWebSockect } from "./controllers/whatsappController.ts";
import { authMiddleware } from "./middleware/authMiddleware.ts";
import cookieParser from "cookie-parser";


const app: Application = Express();
const port: Number = 8080;


app.use(Express.json())
app.use(Express.urlencoded())
app.use(cookieParser())

// Manual CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // Allow all origins

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








