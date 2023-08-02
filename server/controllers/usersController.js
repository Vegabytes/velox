
import connection from '../database/db.js';
import 'dotenv/config'


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
















