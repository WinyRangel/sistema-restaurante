require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');

const path = require('path');


// Asegúrate de que esta línea esté justo después de cargar dotenv
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

// Connect to database
connectDB();

// Middleware para servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(express.json());


// Configuración de CORS
app.use(cors());

// Routes 
app.use('/api/users', require('./routes/auth.routes'));
app.use('/api/platillos', require('./routes/platillo.routes'));


const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en ${PORT}`);
});

