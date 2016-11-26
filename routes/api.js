const express = require('express');
const userCtrl = require('../controllers/userCtrl.js');
const cakeCtrl = require('../controllers/cakeCtrl.js');
const orderCtrl = require('../controllers/orderCtrl.js');
const router = express.Router();

router.post('/users', (req, res, next) => {
  // userCtrl.createUser(req, res);
  console.log("ROW", cakeCtrl.createCake(req, res));
  //orderCtrl.createOrder(1, 1, req, res);
  res.json(req.body);
});

module.exports = router;
