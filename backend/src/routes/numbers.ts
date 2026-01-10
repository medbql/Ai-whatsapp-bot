import { Router } from "express";
import { show, store } from "../controllers/numberController.ts";


export const numbersRouter = Router();


//routes
numbersRouter.get('/:user_id', show);
numbersRouter.post('/', store)
