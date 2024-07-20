require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cors());

// Routes 
app.use('/api/users', require('./routes/auth.routes'));
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});
