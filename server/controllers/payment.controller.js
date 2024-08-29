const axios = require('axios');
const connectDB = require('../config/db');
//const { PAYPAL_API, HOST, PAYPAL_API_CLIENT, PAYPAL_API_SECRET } = require('../config/db.js');
const { PAYPAL_API, HOST, PAYPAL_API_CLIENT, PAYPAL_API_SECRET, HOST_FRONT, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const createOrder = async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).json({ message: 'No se proporcionó un token' });
  }
  console.log("Crear Orden")
  console.log(token)
  try {
    console.log('PayPal Client:', PAYPAL_API_CLIENT);
    console.log('PayPal Secret:', PAYPAL_API_SECRET);
    const { total } = req.body;
    const order = {
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "MXN",
            value: total.toString(),
          },
        },
      ],
      application_context: {
        brand_name: "poritacoffee.com",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${HOST}/capture-order`,  
        cancel_url: `${HOST}/cancel-payment`,
      },
    };

    // format the body
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    // Generate an access token
    const {
      data: { access_token },
    } = await axios.post(
      "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log(access_token);

    // make a request
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      order,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    return res.json(response.data);
  } catch (error) {
    return res.status(500).json("Something goes wrong");
  }
};


// const captureOrder = async (req, res) => {
//   const { token } = req.query;
//   console.log(token);

//   // TODO: HACER QUE LO GUERDE EN LA BD
//   try {
//     const response = await axios.post(
//       `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
//       {},
//       {
//         auth: {
//           username: PAYPAL_API_CLIENT,
//           password: PAYPAL_API_SECRET,
//         },
//       }
//     );

//     console.log(response.data);
//     res.redirect(`${HOST_FRONT}/carrito`);
//     //return res.send('payed');

//     //res.redirect("/payed.html");
//   } catch (error) {
//     console.log(error.message);
//     return res.status(500).json({ message: "Internal Server error" });
//   }
// };

const captureOrder = async (req, res) => {
  const { token } = req.query;
  console.log(token);

  // TODO: HACER QUE LO GUERDE EN LA BD
  try {
    const response = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
      {},
      {
        auth: {
          username: PAYPAL_API_CLIENT,
          password: PAYPAL_API_SECRET,
        },
      }
    );

    console.log(response.data);
    //res.redirect(`${HOST_FRONT}/carrito`);
    res.redirect(`${HOST_FRONT}/carrito?status=aceptado`);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};


//const cancelPayment = (req, res) => res.redirect(`${HOST_FRONT}/inicio`);
const cancelPayment = (req, res) => res.redirect(`${HOST_FRONT}/carrito?status=cancelado`);

const saveCart = async (req, res) => {
  const token = req.headers['authorization'];
  if (!token) {
      return res.status(403).json({ message: 'No se proporcionó un token' });
  }

  console.log('Token recibido:', token);

  try {
      // Decodificar el token para obtener usuarioId y carritoId
      const decoded = jwt.verify(token.split(' ')[1], JWT_SECRET);
      const usuarioId = decoded.usuarioId;
      const carritoId = decoded.carritoId;

      console.log('Usuario ID:', usuarioId);
      console.log('Carrito ID:', carritoId);

      const { total, tipoPagoId } = req.body; //frontend

      const connection = await connectDB();

      // Crear una nueva orden
      const [orderResult] = await connection.query(
          'INSERT INTO Ordenes (usuarioId, tipoPagoId, total) VALUES (?, ?, ?)',
          [usuarioId, tipoPagoId, total]
      );

      const ordenId = orderResult.insertId;

      // Obtener los detalles del carrito
      const [cartItems] = await connection.query(
          'SELECT * FROM ItemsCarrito WHERE carritoId = ?',
          [carritoId]
      );

      // Insertar detalles de la orden
      for (const item of cartItems) {
          const { platilloId, bebidaId, cantidad } = item;

          await connection.query(
              'INSERT INTO DetallesOrden (ordenId, platilloId, bebidaId, cantidad) VALUES (?, ?, ?, ?)',
              [ordenId, platilloId, bebidaId, cantidad]
          );
      }


      //vaciar el carrito 
      await connection.query('DELETE FROM ItemsCarrito WHERE carritoId = ?', [carritoId]);

      res.json({ message: 'Orden y detalles guardados correctamente' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al guardar los datos del carrito' });
  }
};



// Export the functions
module.exports = {
  createOrder,
  captureOrder,
  cancelPayment,
  saveCart
};
