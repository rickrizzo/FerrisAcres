const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const router = express.Router();
const cakeCtrl = require('../controllers/cakeCtrl.js');
const iceCreamCtrl = require('../controllers/iceCreamCtrl.js');
const orderCtrl = require('../controllers/orderCtrl.js');

function moneyToInt(money) {
  return Number(String(money).replace(/[^0-9\.]+/g,""));
}

function sumPrices(cake, icecream) {
  sum = 0;
  cake.forEach(item => {
    sum += moneyToInt(item.price);
  });
  icecream.forEach(item => {
    sum += moneyToInt(item.price) * item.quantity;
  })
  return sum;
}

function getOrderCount(req) {
  var numOrders = 0;
  if(req.cookies.ferrisacres) {
    var cert = fs.readFileSync('private.key', 'utf-8');
    var token = jwt.verify(req.cookies.ferrisacres, cert);
    numOrders = token.cake.length + token.icecream.length;
  }
  return numOrders;
}

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Ferris Acres Creamery',
    orderCount: getOrderCount(req)
  });
});

router.get('/cake', (req, res, next) => {
  fs.readFile('enum/enums.json', function(err, enums) {
    if (err) throw err;
    enums = JSON.parse(enums);
    res.render('cake_order', {
      title: 'Ferris Acres Creamery',
      types: enums.cake_types,
      sizes: enums.cake_sizes,
      flavors: enums.ice_cream_flavors,
      fillings: enums.fillings,
      colors: enums.colors,
      orderCount: getOrderCount(req)
    })
  });
});

router.get('/icecream', (req, res, next) => {
  fs.readFile('enum/enums.json', function(err, enums) {
    if (err) throw err;
    enums = JSON.parse(enums);
    res.render('ice_cream_order', {
      title: 'Ferris Acres Creamery',
      sizes: enums.ice_cream_sizes,
      flavors: enums.ice_cream_flavors,
      orderCount: getOrderCount(req)
    });
  });
});

router.get('/admin', (req, res, next) => {
  orderCtrl.getOrders(req, res, next).then(data => {
    res.render('admin', {
      title: 'Ferris Acres Creamery',
      orders: data,
      orderCount: getOrderCount(req)
    });
  });
});

router.get('/cart', (req, res, next) => {
  if(req.cookies.ferrisacres) {
    var cert = fs.readFileSync('private.key', 'utf-8');
    var token = jwt.verify(req.cookies.ferrisacres, cert);
    cakeCtrl.getCakesById(token.cake).then( cakedata => {
      iceCreamCtrl.getIceCreamsById(token.icecream).then( icecreamdata => {
        res.render('cart', {
          title: 'Ferris Acres Creamery',
          cake: cakedata,
          icecream: icecreamdata,
          sum: sumPrices(cakedata, icecreamdata),
          orderCount: getOrderCount(req),
          pickup: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,11) + '12:00'
        });
      })
    });
  } else {
    res.render('cart', {
      title: 'Ferris Acres Creamery',
      order: [],
      orderCount: getOrderCount(req),
      pickup: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,11) + '12:00'
    });
  }
});

router.get('/order', (req, res, next, getOrderCount) => {
  orderCtrl.getOrderById(req, res, next);
});

router.get('/thanks/:orderid', (req, res, next) => {
  res.render('thanks', {
    title: 'Ferris Acres Creamery',
    order: req.params.orderid,
    orderCount: getOrderCount(req)
  });
});

module.exports = router;
