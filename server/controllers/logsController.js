import connection from '../database/db.js';
import 'dotenv/config'
import fs from 'fs/promises';
import { readFile } from 'fs/promises';

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

export const getLogDetail = async (req, res) => {

  try {
    const { id } = req.params;
    connection.query('SELECT * FROM Logs where id = ?', [id], async (error, results) => {
      if (error) {
        res.status(400).send(error)
        return
      } else {
        try {
          const path = results[0].imagePath;
          const files = await fs.readdir(path);

          await readFile(path + '/meta.json', 'utf8')
            .then((data) => {
              const jsonObject = JSON.parse(data);
              results[0]['metadata'] = jsonObject
            })
            .catch((error) => {
              console.error('Error al leer el archivo:', error);
            });

        } catch (err) {
          console.log(err);
        }

        //Eliminamos el fichero meta de la imagenes
        // files.forEach((f,i)=>{
        //   if(f.indexOf('meta') !== -1){
        //     files.splice(i,1)
        //   }
        // })

        results[0]['images'] = files
        res.status(200).send(results)
      }

    });
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getInfracciones = async (req, res) => {
  try {
    const { idGroup } = req.params;
    connection.query(`
    select i.*, l.createdAt as dateLog, l.eventType, l.data, l.imagePath from Logs as l inner join Infractions as i where l.id = i.idLog and l.deviceId in (SELECT deviceId FROM DeviceGroupMembers where groupId in
      (SELECT deviceGroupId FROM DeviceGroupUserGroup where userGroupId = ${idGroup}))`, async (error, results) => {

      for await (const res of results) {
        try {
          const path = res.imagePath;
          const files = await fs.readdir(path);
          await readFile(path + '/meta.json', 'utf8')
            .then((data) => {
              const jsonObject = JSON.parse(data);
              res['metadata'] = jsonObject
            })
          res['images'] = files
        }
        catch (err) {
          console.log(err);
        }

      };
      if (error) {
        res.status(400).send(error)
        return
      } else {
        res.status(200).send(results)
      }

    });

  } catch (error) {
    res.status(500).send(error)
  }
}

//select * from Infractions as i inner join Logs as l where i.idLog = l.id and i.idLog = 1
export const getInfraccionDetail = async (req, res) => {
  try {
    const { idLog } = req.params;
    connection.query(`select i.*, l.createdAt as dateLog, l.eventType, l.data, l.imagePath, l.position from Infractions as i inner join Logs as l where i.idLog = l.id and i.idLog = ${idLog}`, async (error, results) => {
      for await (const res of results) {
        try {
          const path = res.imagePath;
          const files = await fs.readdir(path);
          await readFile(path + '/meta.json', 'utf8')
            .then((data) => {
              const jsonObject = JSON.parse(data);
              res['metadata'] = jsonObject
            })
          res['images'] = files
        }
        catch (err) {
          console.log(err);
        }
      };
      if (error) {
        res.status(400).send(error)
        return
      } else {
        res.status(200).send(results)
      }

    });
  } catch (error) {
    res.status(500).send(error)
  }
}
