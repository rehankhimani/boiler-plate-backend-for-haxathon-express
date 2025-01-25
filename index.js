import express from "express";
 import bcrypt from "bcrypt"// For password hashing and comparison
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import User from "./model/User.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  }));
app.use(express.json());
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI)
.then(()=>{console.log("=========== Database Connected ===========")})
.catch(err => console.log("=========== Database Connection Failed ===========", err));
  console.log("MONGODB_URI:", MONGODB_URI);


// Example signup route
app.post("/api/auth", (req , res)=>{
  console.log({message:"api connected"})
  res.send({message:"connect"})
})







app.post("/api/auth/signup", async (req, res) => {
  const { fullname, email, password } = req.body;

  // Validate required fields
  if (!fullname || !email || !password) {
    return res.status(400).send({ error: "Missing required fields" });
  }

  // Validate password is a string
  if (typeof password !== "string" || password.trim() === "") {
    return res.status(400).send({ error: "Password must be a non-empty string" });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: "Email already in use" });
    }

    console.log("Password to hash:", password); // Debug log to verify password

    // Hash the password with 10 salt rounds
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the user
    const newUser = new User({
      fullname,
      email,
      password, // Save hashed password
    });

    await newUser.save();
    res.status(201).send({ message: "Signup successful" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send({ error: "Server error, please try again later" });
  }
});

// Login route






app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).send({ error: "Email and password are required" });
  }

  try {
    // Find the user in the database
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // // Compare the provided password with the stored hashed password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    // if (!isPasswordValid) {
    //   return res.status(401).send({ error: "Invalid email or password" });
    // }

    // Successful login
    res.status(200).send({
      message: "Login successful",
      user: { id: user._id, email: user.email, fullname: user.fullname },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ error: "Server error, please try again later" });
  }
});




app.listen(PORT, () => {
console.log(`Server Started on Port: ${PORT}`);
  })

  