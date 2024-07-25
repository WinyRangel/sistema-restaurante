const connectDB = require('../config/db');

const agregarArticuloCarrito = async (req, res) => {
  const { carritoId, bebidaId, platilloId, cantidad } = req.body;

  try {
    const connection = await connectDB();

    // Si se agrega una bebida
    if (bebidaId) {
      const [rows] = await connection.query('SELECT * FROM ItemsCarrito WHERE carritoId = ? AND bebidaId = ?', [carritoId, bebidaId]);
      if (rows.length > 0) {
        await connection.query('UPDATE ItemsCarrito SET cantidad = cantidad + ? WHERE carritoId = ? AND bebidaId = ?', [cantidad, carritoId, bebidaId]);
      } else {
        await connection.query('INSERT INTO ItemsCarrito (carritoId, bebidaId, cantidad) VALUES (?, ?, ?)', [carritoId, bebidaId, cantidad]);
      }
    }

    // Si se agrega un platillo
    if (platilloId) {
      const [rows] = await connection.query('SELECT * FROM ItemsCarrito WHERE carritoId = ? AND platilloId = ?', [carritoId, platilloId]);

      if (rows.length > 0) {
        await connection.query('UPDATE ItemsCarrito SET cantidad = cantidad + ? WHERE carritoId = ? AND platilloId = ?', [cantidad, carritoId, platilloId]);
      } else {
        await connection.query('INSERT INTO ItemsCarrito (carritoId, platilloId, cantidad) VALUES (?, ?, ?)', [carritoId, platilloId, cantidad]);
      }
    }

    res.json({ msg: 'Artículo agregado al carrito correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al agregar artículo al carrito' });
  }
};

const mostrarCarrito = async (req, res) => {
  const { carritoId } = req.params; 

  try {
    const connection = await connectDB();
    const [rows] = await connection.query(`
      SELECT ic.itemCarritoId, p.nombre AS platilloNombre, 
      p.precio as precioPlatillo, b.nombre AS bebidaNombre, b.precio as precioBebida, ic.cantidad,
      p.imagen as imgPlatillo, b.imagen as imgBebida
      FROM ItemsCarrito ic
      LEFT JOIN Platillos p ON ic.platilloId = p.platilloId
      LEFT JOIN Bebidas b ON ic.bebidaId = b.bebidaId
      WHERE ic.carritoId = ?
    `, [carritoId]);

    // obtener las imagenes de la carpeta del servidor
    const result = rows.map(item => ({
      ...item,
      imgPlatillo: item.imgPlatillo ? `http://localhost:3002/uploads/${item.imgPlatillo}` : null,
      imgBebida: item.imgBebida ? `http://localhost:3002/uploads/${item.imgBebida}` : null,
    }));

    res.json(result); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al mostrar el carrito' });
  }
};

module.exports = {
  agregarArticuloCarrito,
  mostrarCarrito
};
