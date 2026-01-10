import { appendFile } from "fs/promises";


export async function logs(msg: string | any) {

  //instialze the time of message
  const time = new Date().toLocaleString();
  const info: string = msg + '/ ' + time + ' \n';

  //add the act to the file 
  await appendFile('app.log', info, 'utf-8');

}
