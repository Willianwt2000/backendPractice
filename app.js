import express from 'express';
import dotenv from 'dotenv';
import db from './conexion.js';
import cors from 'cors'; 

// Configuración inicial
dotenv.config();


const app = express();

// Middlewares

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors());

// app.use(cors({
//   origin: 'http://127.0.0.1:5500' // Solo permitir tu origen frontend
// }));

app.post('/validate', (req, res) => {
  
  const { nombre, apellido, cedula, email, password } = req.body;

  if (!nombre || !apellido || !cedula || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }


  const idValidate = /^\d{11}$/;
  if (!idValidate.test(cedula)) {
    return res.status(400).json({
      message: "La cédula debe tener exactamente 11 dígitos numéricos"
    });
  }

  
  const query = 'INSERT INTO usuarios (nombre, apellido, cedula, email, password) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [nombre, apellido, cedula, email, password], (error, result) => {
    if (error) {
      console.error('Error en la base de datos:', error);
      
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'El email o la cédula ya están registrados.' });
      }
      return res.status(500).json({ message: 'Error interno del servidor.' });
    }

    // Éxito
    console.log(result)
    res.status(201).json({ 
      message: 'Usuario registrado exitosamente', 
      userId: result.insertId 
    });
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});