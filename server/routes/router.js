import express from 'express';
const router = express.Router();
//import connection from '../database/db.js';

import { create } from '../controllers/authController.js'
router.get('/', (req, res) => {
  //connection();
  res.status(200).send('Ruta raíz')
})


router.post('/create', create)

export default router;
