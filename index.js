import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config(); // Load environment variables from .env file

const app = express();

// Setting CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow access from frontend server
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Request methods to allow
    allowedHeaders: ['Content-Type'], // Request headers to allow
  }),
);

app.use(express.json());

// Connect to MongoDB
mongoose
  .connect('mongodb://localhost:27017/moonsh1neDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

// Routes
app.use('/api', apiRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
