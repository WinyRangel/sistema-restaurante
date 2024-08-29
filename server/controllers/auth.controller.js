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
      'INSERT INTO Usuarios (nombre, apellidos, username, password, email, telefono, direccion, rol, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, apellidos, username, hashedPassword, email, telefono, direccion, 'usuario', 'activo']
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

    const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE email = ?', [email]);
    if (rows.length === 0) {
      console.warn(`Intento de inicio de sesión fallido: Usuario no encontrado para email ${email}`);
      return res.status(400).json({ message: 'Correo Electrónico o Contraseña incorrectos' });
    }

    const usuario = rows[0];
    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) {
      console.warn(`Intento de inicio de sesión fallido: Contraseña incorrecta para usuario con email ${email}`);
      return res.status(400).json({ message: 'Correo Electrónico o Contraseña incorrectos' });
    }

    // Actualiza el campo lastLogin
    await connection.execute('UPDATE Usuarios SET lastLogin = NOW() WHERE usuarioId = ?', [usuario.usuarioId]);

    const [carritoRows] = await connection.execute('SELECT carritoId FROM Carritos WHERE usuarioId = ?', [usuario.usuarioId]);
    const carritoId = carritoRows.length > 0 ? carritoRows[0].carritoId : null;

    const token = jwt.sign(
      { usuarioId: usuario.usuarioId, nombre: usuario.nombre, email: usuario.email, carritoId: carritoId, rol: usuario.rol }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token });
    console.log('Token JWT generado y enviado al usuario.', token);
  } catch (err) {
    console.error('Error al intentar iniciar sesión:', err.message);
    res.status(500).json({ message: 'Ocurrió un error al iniciar sesión' });
  }
};


exports.obtenerUsuarios = async (req, res) => {
  try {
    const connection = await db();
    console.log('Obteniendo lista de usuarios registrados');

    // Consulta para obtener todos los usuarios
    const [rows] = await connection.execute('SELECT * FROM Usuarios');

    // Verifica si hay usuarios registrados
    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontraron usuarios registrados' });
    }

    // Responde con la lista de usuarios
    res.json(rows); // <--- Cambiado aquí
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};


exports.eliminarUsuario = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await db();
    console.log(`Intentando eliminar usuario con ID: ${id}`);

    // Verifica si el usuario existe
    const [rows] = await connection.execute('SELECT * FROM Usuarios WHERE usuarioId = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Elimina el usuario
    await connection.execute('DELETE FROM Usuarios WHERE usuarioId = ?', [id]);

    console.log(`Usuario con ID: ${id} eliminado exitosamente`);
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ message: 'Error al eliminar el usuario' });
  }
};

exports.verificarInactividad = async (req, res) => {
  try {
    const connection = await db();
    console.log('Verificando usuarios inactivos');

    const [rows] = await connection.execute('SELECT * FROM Usuarios');

    const now = new Date();
    const unMes = 30 * 24 * 60 * 60 * 1000; // Un mes en milisegundos

    for (const usuario of rows) {
      const lastLogin = new Date(usuario.lastLogin);
      if (now - lastLogin > unMes) {
        // Cambia el estado a "inactivo"
        await connection.execute('UPDATE Usuarios SET status = ? WHERE usuarioId = ?', ['inactivo', usuario.usuarioId]);
        console.log(`Usuario con ID: ${usuario.usuarioId} ha sido marcado como inactivo`);
      }
    }

    res.json({ message: 'Verificación de inactividad completada' });
  } catch (error) {
    console.error('Error al verificar la inactividad:', error);
    res.status(500).json({ message: 'Error al verificar la inactividad' });
  }
};
