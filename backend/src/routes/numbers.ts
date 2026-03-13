import { Router } from "express";
import { show, store } from "../controllers/numberController.js";


export const numbersRouter = Router();


//routes
numbersRouter.get('/:user_id', show);
numbersRouter.post('/', store)
