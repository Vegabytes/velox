import express from 'express';
const router = express.Router();

import { create, login, isAuthenticated, logout } from '../controllers/authController.js'

router.get('/', isAuthenticated, (req, res) => {
  res.status(200).send('Hola desde server')
})


router.post('/create', isAuthenticated, create)
router.post('/login', isAuthenticated, login)
router.get('/logout', isAuthenticated, logout)

export default router;
