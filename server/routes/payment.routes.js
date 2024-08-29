const express = require('express');
const router = express.Router();
const {
  createOrder,
  captureOrder,
  cancelPayment,
  saveCart,
} = require('../controllers/payment.controller');


router.post('/create-order', createOrder);
router.get('/capture-order', captureOrder);
router.get('/cancel-payment',cancelPayment);
router.post('/save-cart', saveCart);


module.exports = router;
