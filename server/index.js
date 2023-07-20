import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/router.js';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//app.use(cookieParser);
app.use('/', router);

app.listen(PORT, () => console.log(`Server running on port : http://localhost:${PORT}`));

