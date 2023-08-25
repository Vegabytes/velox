import express from 'express';
const router = express.Router();
import multer from 'multer'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

import { login, isAuthenticated, logout } from '../controllers/authController.js'
import { getAllGroups, getGroupByGrupoId, getGroupByUserId, createGroup, associateUserUserGroup, getGroupByGroupIdByUserId, uploadImage } from '../controllers/groupController.js'
import { getAllUsers, createUser, getGroupUsers, getNotAssignedUser } from '../controllers/usersController.js'
import { getLogsByDeviceId, getLogDetail } from '../controllers/logsController.js'
import { getDevicesByUserId, getDevice } from '../controllers/devicesController.js'


const MAX_SIZE = 10000000;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './images')
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload =
  multer({
    storage: storage,
    /*     dest: './uploads/', */
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

router.get('/', (req, res) => {
  res.status(200).send('Hola desde server')
})


//Authorization
router.post('/auth/login', login)
router.get('/auth/logout', logout)

//Groups
router.get('/groups', getAllGroups)
router.get('/groups/:groupId/user/:userId', getGroupByGroupIdByUserId)
router.get('/groups/group/:id', getGroupByGrupoId)
router.get('/groups/user/:id', getGroupByUserId)
router.post('/groups/create', createGroup)
/* router.post('/groups/upload', uploadImage) */
router.post('/groups/group/user', associateUserUserGroup)

//Users
router.get('/users', getAllUsers)
router.get('/users/groupUsers/:id', getGroupUsers)
router.post('/users/create', createUser)
router.get('/users/notAssignedUser/:id', getNotAssignedUser)

//Logs
router.get('/logs/device/:id', getLogsByDeviceId)
router.get('/log/:id', getLogDetail)

//Devices
router.get('/devices/user/:id', getDevicesByUserId)
router.get('/device/:id', getDevice)

export default router;
