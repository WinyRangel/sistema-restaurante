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

const eliminarArticuloCarrito = async (req, res) => {
  const { itemCarritoId } = req.params;

  try {
    const connection = await connectDB();
    const [rows] = await connection.query('SELECT cantidad FROM ItemsCarrito WHERE itemCarritoId = ?', [itemCarritoId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: `No se encontró artículo con el ID ${itemCarritoId}` });
    }

    const cantidadActual = rows[0].cantidad;

    if (cantidadActual > 1) {
      await connection.query('UPDATE ItemsCarrito SET cantidad = cantidad - 1 WHERE itemCarritoId = ?', [itemCarritoId]);
      res.json({ msg: 'Cantidad del artículo reducida en 1' });
    } else {
      await connection.query('DELETE FROM ItemsCarrito WHERE itemCarritoId = ?', [itemCarritoId]);
      res.json({ msg: 'Artículo eliminado del carrito' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al modificar el artículo en el carrito' });
  }
};

const vaciarCarrito = async (req, res) => {
  const { carritoId } = req.params;

  try {
    const connection = await connectDB();
    await connection.query('DELETE FROM ItemsCarrito WHERE carritoId = ?', [carritoId]);

    res.json({ msg: 'Carrito vacío correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al vaciar el carrito' });
  }
};

const actualizarCantidadArticulo= async (req, res) => {
  const { itemCarritoId, cantidad } = req.body; 
  try {
    const connection = await connectDB();
    
    const [rows] = await connection.query('SELECT * FROM ItemsCarrito WHERE itemCarritoId = ?', [itemCarritoId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: `No se encontró artículo con el ID ${itemCarritoId}` });
    }

    await connection.query('UPDATE ItemsCarrito SET cantidad = ? WHERE itemCarritoId = ?', [cantidad, itemCarritoId]);
    
    res.json({ msg: 'Cantidad del artículo actualizada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar la cantidad del artículo en el carrito' });
  }
};

module.exports = {
  agregarArticuloCarrito,
  mostrarCarrito,
  eliminarArticuloCarrito,
  vaciarCarrito,
  actualizarCantidadArticulo
};

