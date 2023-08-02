import express from 'express';
const router = express.Router();

import { create, login, isAuthenticated, logout } from '../controllers/authController.js'
import { getDevices, getGroupByGrupoId } from '../controllers/groupController.js'
import { getLogsByDeviceId } from '../controllers/logsController.js'

router.get('/', (req, res) => {
  res.status(200).send('Hola desde server')
})

//Authorization
router.post('/create', create)
router.post('/login', login)
router.get('/logout', logout)

//Groups
router.get('/groups/user/:id', getDevices)
router.get('/groups/group/:id', getGroupByGrupoId)

//Logs
router.get('/devices/logs/:id', getLogsByDeviceId)

export default router;
