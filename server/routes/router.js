import express from 'express';
const router = express.Router();

import { login, isAuthenticated, logout } from '../controllers/authController.js'
import { getAllGroups, getGroupByGrupoId, getGroupByUserId, createUserGroup, associateUserUserGroup } from '../controllers/groupController.js'
import { getAllUsers, createUser, getGroupUsers, getNotAssignedUser } from '../controllers/usersController.js'
import { getLogsByDeviceId } from '../controllers/logsController.js'
import { getDevicesByUserId } from '../controllers/devicesController.js'


router.get('/', (req, res) => {
  res.status(200).send('Hola desde server')
})

//Authorization
router.post('/auth/login', login)
router.get('/auth/logout', logout)

//Groups
router.get('/groups', getAllGroups)
router.get('/groups/group/:id', getGroupByGrupoId)
router.get('/groups/user/:id', getGroupByUserId)
router.post('/groups/group', createUserGroup)
router.post('/groups/group/user', associateUserUserGroup)

//Users
router.get('/users', getAllUsers)
router.get('/users/groupUsers/:id', getGroupUsers)
router.post('/users/create', createUser)
router.get('/users/notAssignedUser/:id', getNotAssignedUser)

//Logs
router.get('/logs/device/:id', getLogsByDeviceId)

//Devices
router.get('/devices/user/:id', getDevicesByUserId)

export default router;
