
import connection from '../database/db.js';
import 'dotenv/config'
import fs from 'fs/promises';

export const getLogsByDeviceId = async (req, res) => {

  try {
    const { id } = req.params;
    connection.query('SELECT * FROM Logs where deviceId = ?', [id], (error, results) => {
      if (error) res.status(400).send(error)
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getLogDetail = async(req,res)=>{

  try{
    const { id } = req.params;
    connection.query('SELECT * FROM Logs where id = ?', [id], async (error, results) => {
      if (error) {
        res.status(400).send(error)
        return
      }else{
        const path = results[0].imagePath;
        const files = await fs.readdir(path);

        //Eliminamos el fichero meta de la imagenes
        files.forEach((f,i)=>{
          if(f.indexOf('meta') != -1){
            files.splice(i,1)
          }
        })  

        results[0]['images'] = files
        res.status(200).send(results)
      }
      
    });
  }catch(error){
    res.status(500).send(error)
  }
} 
