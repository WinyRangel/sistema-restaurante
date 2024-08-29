const connectDB = require('../config/db');

const agregarPuntuacion = async (req, res) => {
  const { usuarioId, bebidaId, platilloId, puntuacion, comentario } = req.body;

  if (!bebidaId && !platilloId) {
    return res.status(400).json({ msg: 'Se debe proporcionar un bebidaId o platilloId' });
  }

  try {
    const connection = await connectDB();
    
    //constante que obtiene la primera coinsidencia 
    //para verificar si el usuario ya ha calificado el platillo o bebida
    const [existing] = await connection.query(
      'SELECT * FROM Puntuaciones WHERE usuarioId = ? AND (bebidaId = ? OR platilloId = ?)',
      [usuarioId, bebidaId, platilloId]
    );

    if (existing.length > 0) {//si ya califico
      // Actualizar la puntuación existente
      await connection.query(
        'UPDATE Puntuaciones SET puntuacion = ?, comentario = ? WHERE puntuacionId = ?',
        [puntuacion, comentario, existing[0].puntuacionId]
      );
      return res.json({ msg: 'Puntuación actualizada correctamente' });
    }

    // Insertar nueva puntuación
    await connection.query(
      'INSERT INTO Puntuaciones (usuarioId, bebidaId, platilloId, puntuacion, comentario) VALUES (?, ?, ?, ?, ?)',
      [usuarioId, bebidaId, platilloId, puntuacion, comentario]
    );

    res.json({ msg: 'Puntuación agregada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al agregar o actualizar la puntuación' });
  }
};

// Obtener todas las puntuaciones de un platillo o bebida
const obtenerPuntuaciones = async (req, res) => {
  const { bebidaId, platilloId } = req.query;

  if (!bebidaId && !platilloId) {
    return res.status(400).json({ msg: 'Se debe proporcionar un bebidaId o platilloId' });
  }

  try {
    const connection = await connectDB();
    
    const [rows] = await connection.query(
      `SELECT p.*, u.nombre AS usuarioNombre
       FROM Puntuaciones p
       JOIN Usuarios u ON p.usuarioId = u.usuarioId
       WHERE (p.bebidaId = ? OR p.platilloId = ?)`,
      [bebidaId, platilloId]
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener las puntuaciones' });
  }
};

// Obtener la puntuación promedio de un platillo o bebida
const obtenerPuntuacionPromedio = async (req, res) => {
  const { bebidaId, platilloId } = req.query;

  if (!bebidaId && !platilloId) {
    return res.status(400).json({ msg: 'Se debe proporcionar un bebidaId o platilloId' });
  }

  try {
    const connection = await connectDB();

    const [result] = await connection.query(
      `SELECT AVG(puntuacion) AS puntuacionPromedio
       FROM Puntuaciones
       WHERE (bebidaId = ? OR platilloId = ?)`,
      [bebidaId, platilloId]
    );

    const puntuacionPromedio = result[0].puntuacionPromedio;

    res.json({ puntuacionPromedio });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la puntuación promedio' });
  }
};

module.exports = {
  agregarPuntuacion,
  obtenerPuntuaciones,
  obtenerPuntuacionPromedio
};
