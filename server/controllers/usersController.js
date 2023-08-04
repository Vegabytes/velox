
import connection from '../database/db.js';
import 'dotenv/config'
import bcryptjs from 'bcryptjs'


export const getAllUsers = async (req, res) => {
  try {
    connection.query('SELECT * FROM Users', (error, results) => {
      if (error) res.status(400).send(error)
      if (results.length === 0) res.status(200).send([]);
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error)
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, lastName, email, address, description, phone, birth, createdBy, path, pass } = req.body;
    let passHash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO Users SET ?', { name, lastName, email, address, description, phone, birth, createdBy, path, pass: passHash }, (error, results) => {
      if (error) res.status(400).send(error)
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error)
  }
};

export const getGroupUsers = async (req,res) => {
  const { id } = req.params;
  try {
    connection.query('SELECT * from Users as u inner join UserGroupMembers as ug where ug.userId = u.id and ug.groupId = ?', [id], (error, results) => {
      if (error) res.status(400).send(error)
      if (results.length === 0) res.status(200).send([]);
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getNotAssignedUser = async (req,res) => {

  const { id } = req.params;
  try {
    connection.query('select * from Users WHERE id NOT IN (SELECT DISTINCT userId FROM UserGroupMembers where groupId = ?)', [id], (error, results) => {
      if (error) res.status(400).send(error)
      if (results.length === 0) res.status(200).send([]);
      res.status(200).send(results)
    });
  } catch (error) {
    res.status(500).send(error)
  }
}
















