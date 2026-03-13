import { Router } from "express";
import { show, store } from "../controllers/bootController.js";


export const bootsRouter = Router();


bootsRouter.get('/:user_id', show)
bootsRouter.post('/', store)
