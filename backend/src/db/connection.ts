import { Pool } from "pg";
import { logs } from "../utils/logs.js";
import dotenv from "dotenv";


dotenv.config();

class Curd {
  protected db: Pool;
  protected table: string;


  public constructor(table: string) {
    this.db = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    })
    this.table = table
  }

  public async All() {
    try {
      const allData = await this.db.query(`SELECT * FROM ${this.table}`);
      if (!allData.rowCount) {
        return allData.rows
      }
    } catch (error) {
      logs(error)
    }
  }

  public async Row(id: number) {
    try {
      const row = await this.db.query(`SELECT * FROM ${this.table} WHERE id = $1 `, [id]);
      if (!row.rowCount) {
        return row
      }

    } catch (error) {
      logs(error)
    }
  }

  public async Insert(dataForm: any) {
    try {
      const data = Object.values(dataForm);
      const places = Array.from({ length: data.length }, (_, i) => '$' + (i + 1)).toString();
      const resp = await this.db.query(`INSERT INTO ${this.table} (${Object.keys(dataForm)}) VALUES (${places}) `, data)
      return resp
    } catch (error) {
      logs(error)
    }
  }

  /**
   * name
   */
  public async Update(id: string, data: object) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const params = keys.map((key, index) => `${key} = ${values[index]}`).join(', ');

    await this.db.query(`UPDATE ${this.table} SET ${params} WHERE  id = $1`, [id]);
  }

  public Delete(id: number) {
    this.db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id]);
  }

}

class Users extends Curd {
  constructor(table: string) {
    super(table)
  }

  async getByEmail(email: string) {
    try {
      const user = await this.db.query(`SELECT * FROM ${this.table} WHERE email = $1 `, [email]);
      return user.rows[0];
    } catch (error) {
      logs(error)
    }
  }

  async getByProviderId(providerId: string) {
    try {
      const user = await this.db.query(`SELECT * FROM ${this.table} WHERE provider_id = $1`, [providerId]);

      if (!user.rowCount) {
        return user.rows[0]
      }
    } catch (error) {
      logs(error)
    }
  }

}

class WhatsappNums extends Curd {
  public constructor(table: string) {
    super(table)
  }

  public async UsersNums(user_id: number) {
    const row = await this.db.query(`SELECT * FROM ${this.table} WHERE user_id = $1 `, [user_id]);
    return row.rows;
  }

  public async Nums(numero: string) {
    const row = await this.db.query(`SELECT * FROM ${this.table} WHERE number =$1`, [numero]);
    return row.rows;
  }

  public async UpdateNum(number: string, data: object) {
    const keys = Object.keys(data);
    const values = Object.values(data);

    const params = keys.map((key, index) => `${key} = ${values[index]}`).join(', ');

    await this.db.query(`UPDATE ${this.table} SET ${params} WHERE  number = $1`, [number]);

  }
}


class Boots extends Curd {
  public constructor(table: string) {
    super(table)
  }

  public async Nums_Join(user_id: number) {
    try {
      const boots = await this.db.query(`SELECT B.name, B.model, W.number  
                                       FROM ${this.table} AS B
                                       INNER JOIN WhatsappNums AS W ON B.number_id = W.id 
                                       WHERE W.user_id= $1`, [user_id]);
      if (boots.rowCount) {
        return boots.rows
      }
    } catch (error) {
      logs(error)
    }
  }

}

const User = new Users('Users');
const Wnums = new WhatsappNums('WhatsappNums');
const Boot = new Boots('Boots');

export { Wnums, Boot, User }
