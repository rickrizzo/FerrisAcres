const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cakeCtrl = require('../controllers/cakeCtrl.js');
const orderCtrl = require('../controllers/orderCtrl.js');
const userCtrl = require('../controllers/userCtrl.js');
const router = express.Router();

// Cake Operations
router.post('/cakes', (req, res, next) => {
  cakeCtrl.createCake(req, res, next).then(data => {
    var token = '';
    var cert = fs.readFileSync('private.key', 'utf-8');
    var cakeOrder = [data[0].cake_id];
    var iceCreamOrder = [];

    if(req.cookies.ferrisacres) {
      token = jwt.verify(req.cookies.ferrisacres, cert);

      if(token.cake) {
        token.cake.forEach(cake => {
          cakeOrder.push(cake);
        });
      }

      if(token.icecream) {
        token.icecream.forEach(icecream => {
          iceCreamOrder.push(icecream);
        })
      }

    }

    token = jwt.sign({ cake: cakeOrder, icecream: iceCreamOrder }, cert, { expiresIn: '12h' });
    res.cookie('ferrisacres', token).redirect("/");
  }).catch(error => {
    return next(error);
  });
});

router.get('/cakes', (req, res, next) => {
  cakeCtrl.getCakes(req, res, next);
});

// Order Operations
router.post('/orders', (req, res, next) => {
  res.json(req.body);
  // orderCtrl.createOrder(req, res, next);
});

router.get('/orders', (req, res, next) => {
  orderCtrl.getOrders(req, res, next);
});

// User Operations
router.get('/users', (req, res, next) => {
  userCtrl.getUsers(req, res, next);
});

module.exports = router;
