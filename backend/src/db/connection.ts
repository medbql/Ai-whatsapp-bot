import { Pool } from "pg";
import { logs } from "../utils/logs.ts";

import dotenv from "dotenv";


dotenv.config();

class Curd {
  protected db: Pool;
  protected table: string;


  public constructor(table: string) {
    this.db = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432')
    })
    this.table = table
  }

  public async All() {
    const allData = await this.db.query(`SELECT * FROM ${this.table}`);
    return allData
  }

  public Row(id: number) {
    const row = this.db.query(`SELECT * FROM ${this.table} WHERE id = $1 `, [id]);
    return row
  }

  public async Insert(dataForm: any) {
    try {

      const data = Object.values(dataForm);
      console.log(data)
      const places = Array.from({ length: data.length }, (_, i) => '$' + (i + 1)).toString();
      await this.db.query(`INSERT INTO ${this.table} (${Object.keys(dataForm)}) VALUES (${places}) `, data)
    } catch (error) {
      logs(error)
    }
  }

  public Delete(id: number) {
    this.db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
  }

}


class WhatsappNums extends Curd {
  public constructor(table: string) {
    super(table)
  }

  public async UsersNums(user_id: number) {
    const row = this.db.query(`SELECT * FROM ${this.table} WHERE user_id = $1 `, [user_id]);
    return row
  }
}


class Boots extends Curd {
  public constructor(table: string) {
    super(table)
  }

  public async Nums_Join(user_id: number) {
    const boots = await this.db.query(`SELECT B.name, B.model, W.number  
                                       FROM ${this.table} AS B
                                       INNER JOIN WhatsappNums AS W ON B.number_id = W.id 
                                       WHERE W.user_id= $1`, [user_id]);
    return boots
  }

}

const Wnums = new WhatsappNums('WhatsappNums');
const Boot = new Boots('Boots');

export { Wnums, Boot }
