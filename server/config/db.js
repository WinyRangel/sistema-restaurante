const mysql = require('mysql2/promise');
require('dotenv').config();

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'admin',
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
