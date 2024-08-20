require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');

const path = require('path');


console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

// Connect to database
connectDB();

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.json());
app.use(cors());


// Routes 
app.use('/api/users', require('./routes/auth.routes'));
app.use('/api/platillos', require('./routes/platillo.routes'));
app.use('/api/bebidas', require('./routes/bebida.routes'));
app.use('/api/carrito', require('./routes/carrito.routes'));
app.use('/api/payment', require('./routes/payment.routes'));

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});

