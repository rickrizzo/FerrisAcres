const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const cakeCtrl = require('../controllers/cakeCtrl.js');
const iceCreamCtrl = require('../controllers/iceCreamCtrl.js');
const orderCtrl = require('../controllers/orderCtrl.js');
const userCtrl = require('../controllers/userCtrl.js');
const loginCtrl = require('../controllers/loginCtrl.js');
const router = express.Router();

function addToToken(data, req) {
  var token = '';
  var cert = fs.readFileSync('private.key', 'utf-8');
  var exists = false;
  var cakeOrder = [];
  var iceCreamOrder = [];

  if(req.cookies.ferrisacres) {
    token = jwt.verify(req.cookies.ferrisacres, cert);

    if(token.cake.length > 0) {
      token.cake.forEach(cake => {
        cakeOrder.push(cake);
      });
    }

    if(token.icecream.length > 0) {
      token.icecream.forEach(icecream => {
        iceCreamOrder.push(icecream);
      })
    }
  }

  if(data.exists) {
    exists = data.exists;
  }
  if(data[0]) {
    if(data[0].ice_cream_id) {
      iceCreamOrder.push(data[0].ice_cream_id);
    }

    if(data[0].cake_id) {
      cakeOrder.push(data[0].cake_id);
    }
  }

  return jwt.sign({ exists: exists, cake: cakeOrder, icecream: iceCreamOrder }, cert, { expiresIn: '12h' });
}

// Cake Operations
router.post('/cakes', (req, res, next) => {
  cakeCtrl.createCake(req, res, next).then(data => {
    var token = addToToken(data, req);
    res.cookie('ferrisacres', token).redirect("/");
  });
});

router.get('/cakes', (req, res, next) => {
  cakeCtrl.getCakes(req, res, next);
});

// Ice Cream Operations
router.post('/icecreams', (req, res, next) => {
  iceCreamCtrl.createIceCream(req, res, next).then(data => {
    var token = addToToken(data, req);
    res.cookie('ferrisacres', token).redirect('/');
  });
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

// Login
router.post('/login', (req, res, next) => {
  loginCtrl.validateUser(req, res, next).then(data => {
    if (data.exists) {
      var token = addToToken(data, req);
      res.cookie('ferrisacres', token).status(200).redirect('/');
    } else {
      res.status(401).redirect('/login');
    }
  }).catch(error => {
    console.log('LOGIN ERROR', error);
  });
});

module.exports = router;
