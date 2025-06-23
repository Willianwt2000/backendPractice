import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { User } from "./userModel.js";
import { connectDB, getDb } from "./db.js";
// import assert from 'assert';

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

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password -createdAt");
    return res.status(200).json({
      users,
    });
  } catch (error) {
    return res.status(500).json({
      message: "❌ Error Server!",
      error: error.message,
    });
  }
});
app.post("/api/validate", async (req, res) => {
  const {  username, email, password, cedula } = req.body;

  console.log(username, email, password, cedula)

  try {
    // Connect to the Atlas cluster
    // await client.connect();

    if (!username || !cedula || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 5) {
      return res.status(400).json({
        message: "Password must be at least 5 characters long",
      });
    }

    const idValidate = /^\d{11}$/;
    if (!idValidate.test(cedula)) {
      return res.status(400).json({
        message: "The ID must have exactly 11 numeric digits",
      });
    }

    const emailValidate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailValidate.test(email)) {
      return res.status(400).json({
        Message: "Invalid email format. Make sure:",
        Details: [
          "Must contain an '@' symbol.",
          "Domain must include a period (.).",
          "Domain extension (after the period) must be at least 2 characters.",
          "Must not contain spaces or prohibited special characters.",
        ],
      });
    }


    const UserData = await User.create({
      username,
      email,
      password,
      cedula,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      insertedId: UserData.insertedId,
    });

  } catch (err) {
    console.error("Error en POST /api/users:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT;
//exigiendo al servidor a darme el puerto
if (PORT === undefined) {
  console.log(`Please define the port in .env or the enviroment`);
  process.exit(-1);
}

app.listen(PORT, () => {
  connectDB().catch(console.error);
  console.log(`🚀 Server running on port http://localhost:${PORT}`);
});
