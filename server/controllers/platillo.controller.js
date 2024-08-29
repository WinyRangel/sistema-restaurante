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

const getPlatillos = async (req, res) => {
  try {
    const connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM Platillos');
    const platillos = rows.map(platillo => ({
      ...platillo,
      imagen: platillo.imagen ? `http://3.128.24.47:3002/uploads/${platillo.imagen}` : null 
    }));
    res.json(platillos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener los platillos' });
  }
};

const getPlatilloById = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM Platillos WHERE platilloId = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ msg: `No se encontró platillo con ID ${id}` });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener el platillo' });
  }
};

const crearPlatillo = async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  const imagen = req.file ? req.file.filename : null;
  try {
    const connection = await connectDB();
    const [result] = await connection.query('INSERT INTO Platillos (nombre, descripcion, precio, imagen) VALUES (?, ?, ?, ?)', [nombre, descripcion, precio, imagen]);
    res.json({ msg: 'Platillo creado correctamente', platilloId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el platillo' });
  }
};

const actualizarPlatillo = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio } = req.body;
  const imagen = req.file ? req.file.filename : req.body.imagen;
  try {
    const connection = await connectDB();
    const [result] = await connection.query('UPDATE Platillos SET nombre = ?, descripcion = ?, precio = ?, imagen = ? WHERE platilloId = ?', [nombre, descripcion, precio, imagen, id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: `No se encontró platillo con ID ${id}` });
    }
    res.json({ msg: 'Platillo actualizado correctamente', platilloId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el platillo' });
  }
};

const eliminarPlatillo = async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await connectDB();
    const [result] = await connection.query('DELETE FROM Platillos WHERE platilloId = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: `No se encontró platillo con el id: ${id}` });
    }
    res.json({ msg: 'Platillo eliminado correctamente', platilloId: id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al eliminar el platillo' });
  }
};

module.exports = {
  getPlatillos,
  getPlatilloById,
  crearPlatillo,
  actualizarPlatillo,
  eliminarPlatillo,
  upload
};
