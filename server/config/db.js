const mysql = require('mysql2/promise');
require('dotenv').config();

// Paypal
const PAYPAL_API_CLIENT = process.env.PAYPAL_API_CLIENT;
const PAYPAL_API_SECRET = process.env.PAYPAL_API_SECRET;
const PAYPAL_API = process.env.PAYPAL_API; // URL sandbox or live for your app
const HOST = 'http://3.128.24.47:3002/api/payment';

const connectDB = async () => {

  try {
    const connection = await mysql.createConnection({
      host: 'sistema-restaurante.cp6o84ukgbxf.us-east-2.rds.amazonaws.com',
      user: 'admin',             
      password: 'sistema2*',  
      database: 'sistemaPedidos',   
      port: 3306             
    });
    console.log('Conexión a base de datos exitosa');
    return connection;
  } catch (err) {
    console.error('Error al conectar a la base de datos:', err.message);
    process.exit(1);
  }
};


module.exports = connectDB;