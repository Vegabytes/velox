import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import connection from '../database/db.js';

import { promisify } from 'util';

export const create = async (req, res) => {
  try {
    const { email, pass } = req.body;
    let passHash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO Users SET ?', { name, email, pass: passHash }, (error, results) => {
      if (error) console.log(error);
      console.log(results);
      res.status(200).send(req.body)
    });
  } catch (error) {
    console.log(error);
  }
}


export const login = async (req, res) => {
  try {
    const { email, pass } = req.body;
    console.log(email, pass);
    if (!email || !user) res.status(400).send('Faltan datos')
    /*     let passHash = await bcryptjs.hash(pass, 8); */
    /*     connection.query('INSERT INTO Users SET ?', { name, email, pass: passHash }, (error, results) => {
          if (error) console.log(error);
          console.log(results);
          res.status(200).send(req.body)
        }); */
  } catch (error) {
    console.log(error);
  }

}
