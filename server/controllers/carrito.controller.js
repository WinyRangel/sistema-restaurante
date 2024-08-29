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


const obtenerOrdenes = async (req, res) => {
  try {
    const connection = await connectDB();
    const [rows] = await connection.query(`
      SELECT 
          o.ordenId,
          u.nombre AS nombreUsuario,
          u.direccion AS direccionUsuario,
          u.email AS emailUsuario,
          o.fechaOrden,
          (COALESCE(SUM(p.precio * do.cantidad), 0) +
          COALESCE(SUM(b.precio * do.cantidad), 0)) AS total, o.estatus as estatus
      FROM 
          Ordenes o
          JOIN Usuarios u ON o.usuarioId = u.usuarioId
          LEFT JOIN DetallesOrden do ON o.ordenId = do.ordenId
          LEFT JOIN Platillos p ON do.platilloId = p.platilloId
          LEFT JOIN Bebidas b ON do.bebidaId = b.bebidaId
      GROUP BY 
          o.ordenId, 
          u.nombre, 
          u.direccion,
          u.email, 
          o.fechaOrden
      ORDER BY 
          o.fechaOrden ASC;
    `);

    if (rows.length === 0) {
      return res.status(404).json({ msg: 'No se encontraron órdenes' });
    }

    res.json(rows); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la información de las órdenes' });
  }
};

const obtenerOrdenesPorUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const connection = await connectDB();
    const [rows] = await connection.query(`
      SELECT 
          o.ordenId,
          u.nombre AS nombreUsuario,
          u.direccion AS direccionUsuario,
          u.email AS emailUsuario,
          o.fechaOrden,
          (COALESCE(SUM(p.precio * do.cantidad), 0) +
          COALESCE(SUM(b.precio * do.cantidad), 0)) AS total, o.estatus as estatus
      FROM 
          Ordenes o
          JOIN Usuarios u ON o.usuarioId = u.usuarioId
          LEFT JOIN DetallesOrden do ON o.ordenId = do.ordenId
          LEFT JOIN Platillos p ON do.platilloId = p.platilloId
          LEFT JOIN Bebidas b ON do.bebidaId = b.bebidaId
      WHERE 
          u.usuarioId = ?
      GROUP BY 
          o.ordenId, 
          u.nombre, 
          u.direccion,
          u.email, 
          o.fechaOrden
      ORDER BY 
          o.fechaOrden ASC;
    `, [usuarioId]);

    if (rows.length === 0) {
      return res.status(404).json({ msg: `No se encontraron órdenes para el usuario con ID ${usuarioId}` });
    }

    res.json(rows); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al obtener la información de las órdenes del usuario' });
  }
};


const actualizarEstadoOrden = async (req, res) => {
  const { ordenId } = req.params;  
  const { nuevoEstado } = req.body; 

  try {
    const connection = await connectDB();
    
    // Validar el nuevo estado
    const estadosValidos = ['Recibido', 'Atendiendo', 'Entregado'];
    if (!estadosValidos.includes(nuevoEstado)) {
      return res.status(400).json({ msg: 'Estado no válido' });
    }

    const [result] = await connection.query('UPDATE Ordenes SET estatus = ? WHERE ordenId = ?', [nuevoEstado, ordenId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: `No se encontró orden con el ID ${ordenId}` });
    }

    res.json({ msg: 'Estado de la orden actualizado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al actualizar el estado de la orden' });
  }
};

module.exports = {
  agregarArticuloCarrito,
  mostrarCarrito,
  eliminarArticuloCarrito,
  vaciarCarrito,
  actualizarCantidadArticulo, 
  obtenerOrdenes,
  obtenerOrdenesPorUsuario,
  actualizarEstadoOrden 
};
