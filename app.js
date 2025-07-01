import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { User } from "./userModel.js";
import { connectDB } from "./db.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Load environment variables
dotenv.config();
const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());


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

app.post("/api/signup", async (req, res) => {
  const { username, email, password, cedula } = req.body;

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


app.delete("/api/delete/:id", async (req, res) => {
  const userIdToDelete = req.params.id; 
  try {
    
    let deleteUsers = await User.findByIdAndDelete(userIdToDelete);
    if (!deleteUsers) return res.status(404).json({ message: "User not found" });
    console.log({Usuario: deleteUsers})
    res.status(204).end()
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})


//Login
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 5) {
      return res.status(400).json({
        message: "Password must be at least 5 characters long",
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

    //Search user in mongoDB
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credential" });

    //Compare password with bycript
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credential" });

    // *  Generate token
    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const isProduction = process.env.NODE_ENV === "production"; // verified if is working in production

    //saving token
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "Lax",
      maxAge: 60 * 60 * 1000,
      path: "/",
    });

    console.log({
      token,
    });


    res.status(200).json({
      message: "Inicio de sesión exitoso",
      user: { email: user.email },
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
  console.log(`🔐 JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Configurado' : '❌ NO CONFIGURADO'}`);
});

