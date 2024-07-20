const connectDB = require('../config/db');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

const getBebidas = async (req, res) => {
  try {
    const connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM Bebidas');
    const bebidas = rows.map(bebida => ({
      ...bebida,
      imagen: bebida.imagen ? `http://localhost:3002/uploads/${bebida.imagen}` : null // Cambia la URL base según tu configuración
    }));
    res.json(bebidas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los bebidas' });
  }
};

const getBebidaById = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM bebidas WHERE bebidaId = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: `No se encontró bebida con ID ${id}` });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el bebida' });
  }
};

const crearBebida = async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  const imagen = req.file ? req.file.filename : null;
  try {
    const connection = await connectDB();
    const [result] = await connection.query('INSERT INTO bebidas (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, imagen]);
    res.json({ msg: 'Bebida creada correctamente', BebidaId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el Bebida' });
  }
};

const actualizarBebida = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  const imagen = req.file ? req.file.filename : req.body.imagen;
  try {
    const connection = await connectDB();
    const [result] = await connection.query('UPDATE bebidas SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE BebidaId = ?', [nombre, descripcion, precio, imagen, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: `No se encontró Bebida con ID ${id}` });
    }
    res.json({ msg: 'Bebida actualizado correctamente', BebidaId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el Bebida' });
  }
};

const eliminarBebida = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await connectDB();
    const [result] = await connection.query('DELETE FROM bebidas WHERE BebidaId = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: `No se encontró Bebida con el id: ${id}` });
    }
    res.json({ msg: 'Bebida eliminado correctamente', BebidaId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar la bebida' });
  }
};

module.exports = {
  getBebidas,
  getBebidaById,
  crearBebida,
  actualizarBebida,
  eliminarBebida,
  upload
};
