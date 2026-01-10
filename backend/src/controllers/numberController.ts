import { type Request, type Response } from "express";
import { Wnums } from "../db/connection.ts";


/*
 * Display user numbers
 */
async function show(req: Request, res: Response): Promise<void> {
  try {
    //the user_id is not undifined
    if (req.params.user_id) {

      const userId: number = parseInt(req.params.user_id);//change the type of user_id to number
      console.log()
      //get numbers from database
      const userNumbers = await Wnums.UsersNums(userId);

      //check if data exist 
      if (userNumbers.length) {
        res.status(201).json({
          data: userNumbers
        })
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
 * store a new number to the user
 */
async function store(req: Request, res: Response): Promise<void> {
  try {
    const { number, user_id } = req.body;

    //check params
    if (!number || !user_id) {
      res.status(400).json({
        message: 'params required.'
      })
      return;
    }

    const inserNum = await Wnums.Insert({ number, user_id });

    if (inserNum?.rowCount === 1) {
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
