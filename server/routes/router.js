import express from 'express';
const router = express.Router();

import { create, login, isAuthenticated, logout } from '../controllers/authController.js'
import { getAllGroups, getGroupByGrupoId, getGroupByUserId, createUserGroup } from '../controllers/groupController.js'
import { getAllUsers } from '../controllers/usersController.js'
import { getLogsByDeviceId } from '../controllers/logsController.js'
import { getDevicesByUserId } from '../controllers/devicesController.js'


router.get('/', (req, res) => {
  res.status(200).send('Hola desde server')
})

//Authorization
router.post('/auth/create', create)
router.post('/auth/login', login)
router.get('/auth/logout', logout)

//Groups
router.get('/groups', getAllGroups)
router.get('/groups/group/:id', getGroupByGrupoId)
router.get('/groups/user/:id', getGroupByUserId)
router.post('/groups/group/', createUserGroup)

//Users
router.get('/users', getAllUsers)

//Logs
router.get('/logs/device/:id', getLogsByDeviceId)

//Devices
router.get('/devices/user/:id', getDevicesByUserId)

export default router;
