const connectDB = require('../config/db');

const agregarArticuloCarrito = async (req, res) => {
  const { carritoId, bebidaId, platilloId, cantidad } = req.body;

  try {
    const connection = await connectDB();

    // Si se agrega una bebida
    if (bebidaId) {
      // Verifica si ya existe el artículo en el carrito
      const [rows] = await connection.query('SELECT * FROM ItemsCarrito WHERE carritoId = ? AND bebidaId = ?', [carritoId, bebidaId]);

      if (rows.length > 0) {
        // Si existe, actualiza la cantidad
        await connection.query('UPDATE ItemsCarrito SET cantidad = cantidad + ? WHERE carritoId = ? AND bebidaId = ?', [cantidad, carritoId, bebidaId]);
      } else {
        // Si no existe, inserta el nuevo artículo
        await connection.query('INSERT INTO ItemsCarrito (carritoId, bebidaId, cantidad) VALUES (?, ?, ?)', [carritoId, bebidaId, cantidad]);
      }
    }

    // Si se agrega un platillo
    if (platilloId) {
      // Verifica si ya existe el artículo en el carrito
      const [rows] = await connection.query('SELECT * FROM ItemsCarrito WHERE carritoId = ? AND platilloId = ?', [carritoId, platilloId]);

      if (rows.length > 0) {
        // Si existe, actualiza la cantidad
        await connection.query('UPDATE ItemsCarrito SET cantidad = cantidad + ? WHERE carritoId = ? AND platilloId = ?', [cantidad, carritoId, platilloId]);
      } else {
        // Si no existe, inserta el nuevo artículo
        await connection.query('INSERT INTO ItemsCarrito (carritoId, platilloId, cantidad) VALUES (?, ?, ?)', [carritoId, platilloId, cantidad]);
      }
    }

    res.json({ msg: 'Artículo agregado al carrito correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al agregar artículo al carrito' });
  }
};



module.exports = {
  agregarArticuloCarrito
};
