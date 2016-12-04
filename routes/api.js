const express = require('express');
const cakeCtrl = require('../controllers/cakeCtrl.js');
const orderCtrl = require('../controllers/orderCtrl.js');
const userCtrl = require('../controllers/userCtrl.js');
const router = express.Router();

// Cake Operations
router.get('/cakes', (req, res, next) => {
  cakeCtrl.getCakes(req, res, next);
});

// Order Operations
router.post('/orders', (req, res, next) => {
  orderCtrl.createOrder(req, res, next);
});

router.get('/orders', (req, res, next) => {
  orderCtrl.getOrders(req, res, next);
});

// User Operations
router.get('/users', (req, res, next) => {
  userCtrl.getUsers(req, res, next);
});

module.exports = router;
