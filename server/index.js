import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config'

import utilsRoutes from './routes/utils.js'

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use('/utils', utilsRoutes);

app.listen(PORT, () => console.log(`Server running on port : http://localhost:${PORT}`));

