import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import connection from '../database/db.js';
import 'dotenv/config'

import { promisify } from 'util';

export const create = async (req, res) => {
  try {
    const { name, email, pass } = req.body;
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
    if (!email || !pass) res.status(400).send('Faltan datos')
    connection.query('SELECT * FROM Users WHERE email = ?', [email], async (error, results) => {
      if (error) console.log(error);
      if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) { res.status(403).send('Usuario incorrecto') }
      else {
        const { id } = results[0];
        console.log("id", id);
        console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);
        const token = await jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIME_EXPIRATION });
        console.log("TOKEN", token);

        //Configuramos las cookies con token
        const cookiesOptions = {
          expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000),
          httpOnly: true
        }

        res.cookie('jwt', token, cookiesOptions)
        res.status(200).send('Usuario autorizado')
      }
    });
  } catch (error) {
    console.log(error);
  }

}
