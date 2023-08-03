import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import connection from '../database/db.js';
import 'dotenv/config'

import { promisify } from 'util';


export const login = async (req, res) => {
  try {
    const { email, pass, groupId } = req.body;

    if (!email || !pass) res.status(400).send('Faltan datos')

    await connection.query('SELECT * FROM Users WHERE email = ?', [email], async (error, results) => {
      if (error) res.status(400).send(error);

      if (results.length === 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
        res.status(403).send({ msg: 'Usuario incorrecto' })
      }
      else {
        const user = results[0];

        try {
          const groupCreatedBy = await getUserGroupCreatedBy(groupId, results[0].id);
          console.log(groupCreatedBy.createdBy);
          console.log(results[0].id);
          if (groupCreatedBy.createdBy === results[0].id) {

            res.status(200).send({ user: user, msg: 'Usuario autorizado', admin: true })
          } else {
            res.status(200).send({ user: user, msg: 'Usuario autorizado', admin: false })
          }
        }
        catch (error) {
          res.status(500).send(error)
        }

        /*     const { id } = user; */
        //const token = await jwt.sign({ id }, process.env.JWT_SECRET || 'velox', { expiresIn: process.env.JWT_TIME_EXPIRATION || '7d' });

        //Configuramos las cookies con token
        /*   const cookiesOptions = {
            expires: new Date(Date.now() + (process.env.JWT_COOKIE_EXPIRATION || 90) * 24 * 60 * 60 * 1000),
            httpOnly: true
          } */

        //res.cookie('jwt', token, cookiesOptions)

      }
    });
  } catch (error) {
    res.status(500).send(error)
  }
}

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
