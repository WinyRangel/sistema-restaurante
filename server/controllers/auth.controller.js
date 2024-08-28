const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');


exports.registroUsuario = async (req, res) => {
  const { nombre, apellidos, username, password, email, telefono, direccion } = req.body;

  try {
    const connection = await db();
    console.log('Usuario intentando registrarse:', email);

    // Verifica que el usuario no exista a través del correo
    const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ message: 'Usuario ya registrado' });
    }

    // Crea el nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await connection.execute(
      'INSERT INTO Usuarios (nombre, apellidos, username, password, email, telefono, direccion, rol) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, username, hashedPassword, email, telefono, direccion, 'usuario']
    );

    const usuarioId = result.insertId;
    console.log('Usuario registrado con éxito, ID:', usuarioId);

    await connection.execute('INSERT INTO Carritos (usuarioId) VALUES (?)', [usuarioId]);

    res.status(201).json({ message: 'Usuario registrado exitosamente', userId: usuarioId });
  } catch (error) {
    console.error('Error en el registro de usuario:', error);
    res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

exports.iniciarSesion = async (req, res) => {
  const { email, password } = req.body;

  try {
    const connection = await db();
    console.log('Usuario intentando iniciar sesión con email:', email);

    // Verifica si el usuario existe
    const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      console.warn(`Intento de inicio de sesión fallido: Usuario no encontrado para email ${email}`);
      return res.status(400).json({ message: 'Correo Electrónico o Contraseña incorrectos' });
    }

    const usuario = rows[0];

    // Verifica la contraseña
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      console.warn(`Intento de inicio de sesión fallido: Contraseña incorrecta para usuario con email ${email}`);
      return res.status(400).json({ message: 'Correo Electrónico o Contraseña incorrectos' });
    }

    // Obtiene el carrito del usuario
    const [carritoRows] = await connection.execute('SELECT carritoId FROM Carritos WHERE usuarioId = ?', [usuario.usuarioId]);
    const carritoId = carritoRows.length > 0 ? carritoRows[0].carritoId : null;

    // Imprime el carritoId en consola
    console.log(`Usuario ${usuario.nombre} (ID: ${usuario.usuarioId}) ha iniciado sesión. Carrito ID: ${carritoId}`);

    // Genera el token JWT
    const token = jwt.sign(
      { usuarioId: usuario.usuarioId, nombre: usuario.nombre, email: usuario.email, carritoId: carritoId, rol: usuario.rol }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Enviar respuesta con token
    res.json({ token });
    console.log('Token JWT generado y enviado al usuario.', token);
  } catch (err) {
    console.error('Error al intentar iniciar sesión:', err.message);
    res.status(500).json({ message: 'Ocurrió un error al iniciar sesión' });
  }
};

