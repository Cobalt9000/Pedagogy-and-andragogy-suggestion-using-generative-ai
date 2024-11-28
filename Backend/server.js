import express from 'express';
import { Octokit } from 'octokit';
import cors from 'cors';
import dotenv from "dotenv";
import connectToMongoDB from './db.js';
import mongoose from 'mongoose';
import User from './models/user.model.js';
import bcrypt from 'bcryptjs'
import cookieParser from 'cookie-parser';
import generateTokenAndSetCookie from './utils/generateToken.js';
import logger from './utils/logger.js';
import authRoutes from './routes/auth.js';
import fetchRemoteLogFile from './utils/fetchRemoteLogFile.js';
import https from 'https';
import axios from 'axios';
import querystring from 'querystring';  
import ragRoutes from './routes/rag.routes.js';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser())
app.use(cors({
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/rag', ragRoutes);

app.post('/signup', async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send({ msg: "The passwords do not match" });
  }

  const userExists = await User.findOne({ username });
  if (userExists) {
    return res.status(400).send({ msg: "User already exists" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });

    if (newUser) {
      await newUser.save();
      logger.info('User created successfully', { username });
      return res.status(200).send({ msg: `User ${newUser.username} has been created` });
    } else {
      logger.error('Error during user creation', { username, error: err.message });
      return res.status(400).send({ msg: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).send({ msg: "An error occurred", error: err.message });
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).send({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send({ msg: "Invalid Credentials" });
    }

    generateTokenAndSetCookie(username, res);
    return res.status(200).send({ msg: `User ${username} logged in` });
  } catch (err) {
    logger.error('Error during login', { username, error: err.message });
    return res.status(500).send({ msg: "Internal Server Error", error: err.message });
  }
});

app.get('/user', (req, res) => {
  const token = req.cookies.jwt;
  if (!token) {
    logger.warn('Unauthorized access attempt');
    return res.status(401).send({ msg: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.status(200).send({ username: decoded.username });
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).send({ msg: 'Unauthorized' });
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('jwt');
  logger.info('User logged out');
  res.status(200).send({ msg: 'Logged out' });
});

app.get('/google-client-id', (req, res) => {
  res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
});

// Learning Plan Generation Route
app.post("/api/generate-learning-plan", async (req, res) => {
    const { name, age, subject, learningStyle, strengths, weaknesses } = req.body;

    const GROQ_API_KEY = process.env.GROQ_API_KEY;

    const prompt = `
    Create a personalized learning plan for a student with the following details:
    Name: ${name}
    Age: ${age}
    Subject: ${subject}
    Learning Style: ${learningStyle}
    Strengths: ${strengths}
    Weaknesses: ${weaknesses}
    The learning plan should include:
    1. Recommended teaching methods
    2. Youtube Channels (around 3) that are popular for teaching this subject
    3. Suggested resources
    4. Personalized learning goals with a plan and roadmap in weeks
    5. Strategies to address weaknesses
    6. Ways to leverage strengths
    `;

    try {
        const response = await axios.post(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                messages: [{ role: "user", content: prompt }],
                model: "mixtral-8x7b-32768",
                temperature: 0.7,
                max_tokens: 2000,
            },
            {
                headers: {
                    Authorization: `Bearer ${GROQ_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        
        res.json({ learningPlan: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Error generating learning plan:", error.message);
        res.status(500).json({ error: "Failed to generate learning plan." });
    }
});

app.listen(port, () => {
  connectToMongoDB();
  logger.info(`Server is running on http://localhost:${port}`);
});