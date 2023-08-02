
import connection from '../database/db.js';
import 'dotenv/config'
import bcryptjs from 'bcryptjs'


export const getAllUsers = async (req, res) => {
  try {
    connection.query('SELECT * FROM Users', (error, results) => {
      if (error) console.log(error);
      if (results.length === 0) res.status(200).send({});
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error)
    console.log(error);
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, lastName, email, address, description, phone, birth, createdBy, path, pass } = req.body;
    let passHash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO Users SET ?', { name, lastName, email, address, description, phone, birth, createdBy, path, pass: passHash }, (error, results) => {
      if (error) console.log(error);
      console.log(results);
      res.status(200).send(req.body)
    });
  } catch (error) {
    console.log(error);
  }
}















