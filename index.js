import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import authRouter from './router/authRouter.js';
import productRouter from './router/productRouter.js';
import salesRouter from './router/salesRouter.js';
import expenseRouter from './router/expenseRouter.js';
import statisticsRouter from './router/statistics.js';

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://wizzypos.vercel.app/', // Adjust this to match your frontend deployment URL
}));
app.use(bodyParser.json());
app.use(express.json());
app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api', salesRouter);
app.use('/api/statistics', statisticsRouter);
app.use('/api/expenses', expenseRouter);

// Serve the starting page
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'starting-page.html'));
});
app.get('/statistics', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'statistics.html'));
});

// Serve other HTML files
app.get('/home', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'home.html'));
});
app.get('/sales-history', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'salesHistory.html'));
});
app.get('/expense', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'expense.html'));
});
app.get('/all-products', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'productCollection.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'login.html'));
});

app.get('/pos', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'register.html'));
});

app.get('/profile', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'profile.html'));
});

// Connect to MongoDB using environment variable
const mongoURI = process.env.MONGODB_URI;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
console.log('MONGO_URI:', process.env.MONGO_URI);

export default app;
