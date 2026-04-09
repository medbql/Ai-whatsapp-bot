import { type Request, type Response } from "express";
import { Boot } from "../db/connection.js";


/*
 * Display user boots
 */
async function show(req: Request, res: Response): Promise<void> {
  try {
    //the user_id is not undifined
    if (req.params.user_id) {

      const userId: number = parseInt(req.params.user_id as string);//change the type of user_id to number

      //get boots from database
      const userBoots = await Boot.Nums_Join(userId)


      //check if data exist 
      if (userBoots) {
        res.status(201).json({ data: userBoots })
      }
    }

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error
    })
  }
}

/*
 * store a new boot to the user
 */
async function store(req: Request, res: Response): Promise<void> {
  try {
    const { botName, botModel, number_id } = req.body;

    //check params
    if (!botName || !botModel || !number_id) {
      res.status(400).json({
        message: 'params required.'
      })
      return;
    }

    const insertBoot = await Boot.Insert({ name: botName, model: botModel, number_id });

    if (insertBoot?.rowCount === 1) {
      res.status(201).json({
        success: true,
        message: 'insert successfly.'
      })
    }


  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error
    })

  }
}

export { show, store }

