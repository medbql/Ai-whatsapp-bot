import { Router } from "express";
import { show, store } from "../controllers/bootController.ts";


export const bootsRouter = Router();


bootsRouter.get('/:user_id', show)
bootsRouter.post('/', store)
