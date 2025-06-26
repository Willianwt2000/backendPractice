import mongoose from "mongoose";
import bcrypt from "bcrypt";



const userSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cedula: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// En tu modelo User.js (recomendado)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Evita re-hashear si no cambió.
  const salt = await bcrypt.genSalt(10); 
  this.password = await bcrypt.hash(this.password, salt); 
  next();
});

export const User = mongoose.model("User", userSchema);