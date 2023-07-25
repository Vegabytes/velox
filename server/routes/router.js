import express from 'express';
const router = express.Router();

import { create, login, isAuthenticated, logout } from '../controllers/authController.js'

router.get('/', (req, res) => {
  res.status(200).send('Hola desde server')
})


router.post('/create', create)
router.post('/login', login)
router.get('/logout', logout)

export default router;
