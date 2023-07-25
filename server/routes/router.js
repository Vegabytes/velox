import express from 'express';
const router = express.Router();

import { create, login, isAuthenticated, logout } from '../controllers/authController.js'
import { getDevices } from '../controllers/groupController.js'

router.get('/', (req, res) => {
  res.status(200).send('Hola desde server')
})

//Authorization
router.post('/create', create)
router.post('/login', login)
router.get('/logout', logout)

//Groups
router.get('/groups/user/:id', getDevices)

export default router;
