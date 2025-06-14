// src/conexion.js
import mysql from 'mysql';
import dotenv from 'dotenv'; // IMPORTANTE: Importa dotenv
dotenv.config(); // IMPORTANTE: Carga las variables de entorno desde .env

// **DEBUGGING:** Añade estos console.log para verificar si las variables se cargan
console.log('DEBUG: DB_HOST:', process.env.DB_HOST);
console.log('DEBUG: DB_USER:', process.env.DB_USER);
console.log('DEBUG: DB_NAME:', process.env.DB_NAME);


// Conexión a MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});


db.connect((err) => {
  if (err) {
    console.error('❌ Error conectando a la base de datos:', err.message);
    console.error(err);
  } else {
    console.log('✅ Conexión exitosa a MySQL en la web!');
  }
});

export default db;
