import express from 'express';
import { getCountries } from '../controllers/utils.js';
const router = express.Router();


// all routes in here are starting with /utils
router.get('/getCountries', getCountries);

export default router;