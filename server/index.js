import express from 'express';
import bodyParser from 'body-parser';
/* import cookieParser from 'cookie-parser';
import cors from 'cors'; */
import router from './routes/router.js';
import 'dotenv/config'

const app = express();
const PORT = process.env.PORT || 5000;

/* app.use(cors()) */

// CORS
app.use(function (req, res, next) {
  /*   res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept"); */
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


/* app.use(cookieParser()); */
app.use('/', router);


app.listen(PORT, () => console.log(`Server running on port : http://localhost:${PORT}`));

