import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import router from './routes/router.js';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 5000;
console.log("cors", cors);
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use('/', router);


//Para eliminar la cache
/* app.use(function (req, res, next) {
  if (!req.user)
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
}); */
app.listen(PORT, () => console.log(`Server running on port : http://localhost:${PORT}`));

