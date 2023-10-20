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
    const { idInfraction } = req.params;
    connection.query(`select i.*, l.createdAt as dateLog, l.eventType, l.data, l.imagePath,l.position, l.imagePath from Logs as l inner join Infractions as i where l.id = i.idLog and i.idLog = ${idInfraction}  order by createdAt desc limit 1`, async (error, results) => {
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


export const saveInfraction = async (req, res) => {
  const { payload } = req.body;
  const { idInfraction } = req.params;
  const { infractionDesc, infractionArticle, idLog, createdBy, type, price,
    points, status, vehicle, plate, emissions, emissionsZone, description,
    address, color, model, maker, vehicleType, driverName, driverSurname,
    driverId, driverAddress, driverCP, organism } = payload;

  try {
    connection.query(`INSERT INTO Infractions (idLog, infractionDesc, infractionArticle,
      createdBy, type,price,points,status,vehicle,plate,
       emissions,emissionsZone, description,address,color,model,maker,vehicleType,
       driverName,driverSurname,driverId,driverAddress,driverCP,organism
    )
     VALUES (${idLog},'${infractionDesc}','${infractionArticle}',${createdBy},
     '${type}','${price}',${points},'${status}','${vehicle}','${plate}','${emissions}',
     '${emissionsZone}','${description}','${address}','${color}',
     '${model}','${maker}','${vehicleType}','${driverName}','${driverSurname}','${driverId}',
     '${driverAddress}','${driverCP}','${organism}')`, (error, results) => {
      if (error) {
        console.log("error", error);
        res.status(401).send({ msg: 'Error al modificar la infracción' })
        return;
      } else {
        res.status(200).send('Infracción modificada correctamente')
      }
    });
  } catch (error) {
    res.status(500).send(error);
    return;
  }
}
