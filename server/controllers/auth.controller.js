const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

exports.registroUsuario = async (req, res) => {
  const { nombre, apellidos, username, password, email, telefono, direccion } = req.body;

  try {
    const connection = await db();

    // Verifica que el usuario no exista a través del correo
    const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Este correo ya se encuentra registrado' });
    }

    // Encriptación de contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insertar usuario a la tabla
    const [result] = await connection.execute('INSERT INTO Usuarios (nombre, apellidos, username, password, email, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?, ?)', [nombre, apellidos, username, hashedPassword, email, telefono, direccion]);
    const usuarioId = result.insertId;

    // Genera el token
    const token = jwt.sign({ usuarioId, nombre, apellidos, username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar respuesta con mensaje y token
    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await db();

    // Check if user exists
    const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Correo Electrónico o Contraseña incorrectos' });
    }

    const usuario = rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Correo Electrónico o contraseña invalidos' });
    }

    // Generate JWT token
    const token = jwt.sign({ UsuarioId: usuario.id, nombre: usuario.nombre, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
