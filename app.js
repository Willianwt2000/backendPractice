import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect, getDb } from "./db.js";
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

// Conectar al iniciar
connect().catch(console.error);
app.post("/validate", async (req, res) => {
  const { fullName, email, password, cedula } = req.body;

  try {
    // Connect to the Atlas cluster
    // await client.connect();
    // Get the database and collection on which to run the operation
    const db = getDb();
    const col = db.collection("users");

    const userData = {
      fullName,
      email,
      password,
      cedula,
      createdAt: new Date(),
    };

    if (!fullName || !cedula || !email || !password) {
      return res
        .status(400)
        .json({ message: "Todos los campos son obligatorios" });
    }

    const idValidate = /^\d{11}$/;
    if (!idValidate.test(cedula)) {
      return res.status(400).json({
        message: "La cédula debe tener exactamente 11 dígitos numéricos",
      });
    }

    const result = await col.insertOne(userData);
    res.status(201).json({
      success: true,
      insertedId: result.insertedId,
    });

    console.log(result);
  } catch (err) {
    console.error("Error en POST /api/users:", err);
    res.status(500).json({ error: err.message });
  } finally {
    await client.close();
  }
});

const PORT = process.env.PORT;
//exigiendo al servidor a darme el puerto
if (PORT === undefined) {
  console.log(`Please define the port in .env or the enviroment`);
  process.exit(-1);
}
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
