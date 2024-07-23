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

    // Crear carrito para el nuevo usuario
    await connection.execute('INSERT INTO Carritos (usuarioId) VALUES (?)', [usuarioId]);


    // Genera el token
    const token = jwt.sign({ usuarioId, nombre, apellidos, username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Enviar respuesta con mensaje y token
    console.log('usuario registrado exitosamente')
    res.status(201).json({ message: 'Usuario registrado exitosamente', token });
  } catch (err) {
    console.error(err.message);
    console.log(error);
    res.status(500).json({ message: 'Ocurrió un error al registrar el usuario' });
  }
};

exports.iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await db();

    // Verifica si el usuario existe
    const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Correo Electrónico o Contraseña incorrectos' });
    }

    const usuario = rows[0];

    // Verifica la contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Correo Electrónico o Contraseña incorrectos' });
    }

    // Obtiene el carrito del usuario
    const [carritoRows] = await connection.execute('SELECT carritoId FROM Carritos WHERE usuarioId = ?', [usuario.usuarioId]);
    const carritoId = carritoRows.length > 0 ? carritoRows[0].carritoId : null;

    // Imprime el carritoId en consola
    console.log('Carrito del usuario:', carritoId);

    // Genera el token JWT
    const token = jwt.sign({ UsuarioId: usuario.id, nombre: usuario.nombre, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    res.json({ token });

    // Enviar respuesta 
    console.log('usuario logueado')
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Ocurrió un error al iniciar sesión' });
  }

};


