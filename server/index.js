import express from 'express';
import bodyParser from 'body-parser';
/* import cookieParser from 'cookie-parser';*/
import router from './routes/router.js';
import 'dotenv/config'


import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import history from 'connect-history-api-fallback';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


// Middleware
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.set('port', process.env.PORT || 5000);

app.use(express.static('http://185.166.213.42//var/www/html/velocikaptor/images'));
app.use('/images', express.static('images'));




/* app.use(cookieParser()); */
app.use('/', router);

// Middleware para Vue.js router modo history
app.use(history());
/* app.use(express.static(path.join(__dirname, 'public'))); */

app.listen(app.get('port'), function () {
  console.log('Velox listening on port: ' + app.get('port'));
});

