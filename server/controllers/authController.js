import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import connection from '../database/db.js';
import 'dotenv/config'

import { promisify } from 'util';


export const login = async (req, res) => {
  const { email, pass, groupId } = req.body;

  try {
    const userByEmail = await getUserByEmail(email);

    if (!userByEmail || !(await bcryptjs.compare(pass, userByEmail.pass))) {
      res.status(403).send({ msg: 'Usuario incorrecto' })
    } else {
      const groupCreatedBy = await getUserGroupCreatedBy(groupId);

      if (groupCreatedBy.createdBy === userByEmail.id) {

        res.status(200).send({ user: userByEmail, msg: 'Usuario autorizado', admin: true })
      } else {
        res.status(200).send({ user: userByEmail, msg: 'Usuario autorizado', admin: false })
      }
    }
  }
  catch (error) {
    console.log("error", error);
    res.status(500).send({ msg: 'Error del sistema' })
  }
}


const getUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT * FROM  Users WHERE email = ?', [email], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements[0]);
    });
  });
};

const getUserGroupCreatedBy = (groupId) => {
  return new Promise((resolve, reject) => {
    connection.query('SELECT createdBy FROM  UserGroups WHERE id = ?', [groupId], (error, elements) => {
      if (error) {
        return reject(error);
      }
      return resolve(elements[0]);
    });
  });
};




export const isAuthenticated = async (req, res, next) => {
  console.log('req.cookies', req.cookies);
  if (req.cookies.jwt) {
    /*     try {
          const decodified = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
          console.log("decodified", decodified);
          connection.query('SELECT * FROM Users WHERE id = ?', decodified.id), (error, results) => {
            if (!results) return next()
            req.user = results[0];
            return next();
          }
        } catch (error) {
          console.log(error);
          return next();
        } */
  } else {
    //res.status(400).send('Usuario no autenticado')
    next();
  }
}



export const logout = async (req, res) => {
  res.clearCookie('jwt');
  res.status(200).send('Usuario deslogado')

}
