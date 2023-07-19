import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import connection from '../database/db.js';

import { promisify } from 'util';


//procedimiento para registrarse

export const create = async (req, res) => {
  console.log("Create controller");
  /*   const { name, email, pass } = req.body;
    console.info(`${name} - ${email} - ${pass}`); */
}
