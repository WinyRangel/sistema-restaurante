const axios = require('axios');
//const { PAYPAL_API, HOST, PAYPAL_API_CLIENT, PAYPAL_API_SECRET } = require('../config/db.js');
const { PAYPAL_API, HOST, PAYPAL_API_CLIENT, PAYPAL_API_SECRET, HOST_FRONT } = process.env;

const createOrder = async (req, res) => {
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

const captureOrder = async (req, res) => {
  const { token } = req.query;

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
    res.redirect(`${HOST_FRONT}/carrito`);
    //return res.send('payed');

    //res.redirect("/payed.html");
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Internal Server error" });
  }
};

const cancelPayment = (req, res) => res.redirect(`${HOST_FRONT}/carrito`);

// Export the functions
module.exports = {
  createOrder,
  captureOrder,
  cancelPayment,
};
