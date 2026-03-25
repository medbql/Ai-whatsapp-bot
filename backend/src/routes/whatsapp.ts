import { Router } from "express";
import { QrCode, start } from "../controllers/whatsappController.js";


export const whatsappRouter = Router();

whatsappRouter.get('/:session_id', QrCode)
whatsappRouter.post('/', start)

