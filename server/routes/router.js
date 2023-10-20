import express from 'express';
const router = express.Router();
import multer from 'multer'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from 'uuid';

import { login, isAuthenticated, logout } from '../controllers/authController.js'
import { getAllGroups, getGroupByGrupoId, getGroupByUserId, createGroup, associateUserUserGroup, getGroupByGroupIdByUserId, getGroupsPrueba } from '../controllers/groupController.js'
import { getAllUsers, createUser, getGroupUsers, getNotAssignedUser, getNotAssignedUserByEmail, isAdmin, setUserIntoGroup } from '../controllers/usersController.js'
import { getLogsByDeviceId, getLogDetail, getInfracciones, getInfraccionDetail, saveInfraction } from '../controllers/logsController.js'
import { getDevicesByUserId, getDevice, getDevicesIdByGroup, getPositionDevice, getDevicesGroupsNotAssigned, setDevicesIntoGroup } from '../controllers/devicesController.js'

const MAX_SIZE = 10000000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/groups')
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname))
  }
});
const upload =
  multer({
    storage: storage,
    limits: {
      fileSize: MAX_SIZE
    }
  });

router.post('/groups/upload', upload.single("file"), async (req, res) => {
  try {
    await sharp(req.file.path)
      .resize(300)
      .background('white')
      .embed()
      .toBuffer()
  } catch (err) {

  }
  res.json({ file: req.file });
})

const storageUsers = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images/users')
  },
  filename: (req, file, cb) => {

    console.log(file);
    cb(null, uuidv4() + path.extname(file.originalname))
  }
});
const uploadUsers =
  multer({
    storage: storageUsers,
    limits: {
      fileSize: MAX_SIZE
    }
  });

router.post('/users/upload', uploadUsers.single("file"), async (req, res) => {
  try {
    await sharp(req.file.path)
      .resize(300)
      .background('white')
      .embed()
      .toBuffer()
  } catch (err) {

  }
  res.json({ file: req.file });
})

router.get('/', (req, res) => {
  res.status(200).send('Hola desde server')
})

//Authorization
router.post('/auth/login', login)
router.get('/auth/logout', logout)

//Groups
router.get('/groups', getAllGroups)
router.get('/groups/:groupId/user/:userId', getGroupByGroupIdByUserId)
router.get('/groups/:groupId/userAdmin/:userId', getGroupByGroupIdByUserId)
router.get('/groups/group/:id', getGroupByGrupoId)
router.get('/groups/user/:id', getGroupByUserId)
router.post('/groups/create', createGroup)
router.post('/groups/group/user', associateUserUserGroup)
router.get('/groups/prueba/:idGroup/:idUser', getGroupsPrueba)

//Users
router.get('/users', getAllUsers)
router.get('/users/groupUsers/:id', getGroupUsers)
router.post('/users/create', createUser)
router.get('/users/notAssignedUser/:id', getNotAssignedUser)
router.post('/users/notAssignedUserByEmail/:id', getNotAssignedUserByEmail)
router.post('/user/assign', setUserIntoGroup)
router.get('/user/admin/:idGroup/:idUser', isAdmin)

//Logs
router.get('/logs/device/:id', getLogsByDeviceId)
router.get('/log/:id', getLogDetail)
router.get('/infracciones/:idGroup', getInfracciones)
router.get('/infraccion/:idInfraction', getInfraccionDetail)
router.post('/infraccion/:idInfraction', saveInfraction)

//Devices
router.get('/devices/user/:id', getDevicesByUserId)
router.get('/devices/:idGroup', getDevicesIdByGroup)
router.get('/device/:id', getDevice)
router.get('/device/:id/position', getPositionDevice)
router.get('/device/notAssignedDeviceGroup/:idGroup', getDevicesGroupsNotAssigned)
router.post('/devices/assign', setDevicesIntoGroup)

export default router;
