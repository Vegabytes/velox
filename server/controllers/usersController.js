
import connection from '../database/db.js';
import 'dotenv/config'
import bcryptjs from 'bcryptjs'

export const setUserIntoGroup = async (req, res) => {

  const { userId, groupId } = req.body;

  try {
    connection.query(`INSERT INTO UserGroupMembers (userId, groupId)VALUES(${userId},${groupId})`, (error, results) => {
      if (error) {
        res.status(401).send({ msg: 'Esta asociación ya existe' })
        return;
      } else {
        res.status(200).send('Usuario asignado a grupo correctamente')
      }
    });
  } catch (error) {
    res.status(500).send(error);
    return;
  }
}

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
    const { name, lastName, email, address, description, phone, birth, createdBy, path, pass, status } = req.body;
    const userExist = await checkEmailExist(email);
    if (userExist.length > 0) {
      res.status(409).send({ msg: 'El usuario ya existe' })
    } else {
      let passHash = await bcryptjs.hash(pass, 8);
      connection.query('INSERT INTO Users SET ?', { name, lastName, email, address, description, phone, birth, createdBy, path, pass: passHash, status }, (error, results) => {
        if (error) res.status(400).send(error)
        res.status(200).send(req.body)
      });
    }


  } catch (error) {
    res.status(500).send(error)
  }
};

export const getGroupUsers = async (req, res) => {
  const { id } = req.params;
  try {
    connection.query('SELECT * from Users as u inner join UserGroupMembers as ug where ug.userId = u.id and ug.groupId = ?', [id], (error, results) => {
      if (error) {
        res.status(400).send(error)
        return;
      } else if (results.length === 0) {
        res.status(200).send([])
      } else {
        res.status(200).send(results)
      }
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

export const getNotAssignedUser = async (req, res) => {

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

export const getNotAssignedUserByEmail = async (req, res) => {

  const { id } = req.params;
  const { email } = req.body;

  try {
    connection.query(`select * from Users WHERE id NOT IN (SELECT DISTINCT userId FROM UserGroupMembers where groupId = ${id}) and (name like "%${email}%" or lastName like "%${email}%")`, (error, results) => {
      if (res.length === 0) {
        res.status(200).send([]);
      } else {
        res.status(200).send(results)
      }
    })
  } catch (error) {
    res.status(500).send(error)
  }
}

//SELECT * from UserGroups where id = ${idGroup} and createdBy = ${idUser}
export const isAdmin = async (req, res) => {
  const { idGroup, idUser } = req.params;
  try {
    connection.query(`SELECT * from UserGroups where id = ${idGroup} and createdBy = ${idUser}`, (error, results) => {
      if (error) res.status(400).send(error)
      if (results.length === 0) {
        res.status(200).send({ admin: false });
      } else {
        res.status(200).send({ admin: true })
      }
    });
  } catch (error) {
    res.status(500).send(error)
  }
}


const checkEmailExist = (email) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT email FROM  Users WHERE email = ?', [email], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements);
    });
  });
};















