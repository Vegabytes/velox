import express from 'express';
const router = express.Router();
import { create } from '../controllers/authController.js'


router.get('/', (req, res) => {
  //connection();
  console.log("Raiz login");
  res.status(200).send('Ruta raíz del login')
})

/* router.get('/create', (req, res) => {
  //connection();
  console.log("Create login");
}) */


router.get('/create', create)

export default router;
