import mysql from 'mysql'
import 'dotenv/config'

const connection = mysql.createConnection({
  host: process.env.DB_HOST || '185.166.213.42',
  user: process.env.DB_USER || 'userdevr',
  password: process.env.DB_PASS || 'mysql202',
  database: process.env.DB_DATABASE || 'velocikaptor'
})

connection.connect(error => {
  if (error) {
    console.log(`El error de conexión es ${error}`)
    return;
  }
  console.log('Conectado a la base de datos MYSQL');
});

export default connection;
