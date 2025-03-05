import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();

// Setting CORS
app.use(cors({
    origin: 'http://localhost:3000', // React app URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Request methods to allow
    allowedHeaders: ['Content-Type'], // Request headers to allow
}));

app.use(express.json());


mongoose.connect('mongodb://localhost:27017/moonsh1neDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
.catch((error) => console.log(error));

app.use('/api', apiRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));