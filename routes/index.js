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

router.get('/', (req, res, next) => {
  var numOrders = 0;

  if(req.cookies.ferrisacres) {
    var cert = fs.readFileSync('private.key', 'utf-8');
    var token = jwt.verify(req.cookies.ferrisacres, cert);
    numOrders = token.cake.length + token.icecream.length;
  }

  res.render('index', {
    title: 'Ferris Acres Creamery',
    orderCount: numOrders
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
      colors: enums.colors
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
      flavors: enums.ice_cream_flavors
    });
  });
});

router.get('/admin', (req, res, next) => {
  orderCtrl.getOrders(req, res, next).then(data => {
    res.render('admin', {
      title: 'Ferris Acres Creamery',
      orders: data
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
          pickup: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,11) + '12:00'
        });
      })
    });
  } else {
    res.render('cart', {
      title: 'Ferris Acres Creamery',
      order: [],
      pickup: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,11) + '12:00'
    });
  }
});

router.get('/order', (req, res, next) => {
  orderCtrl.getOrderById(req, res, next);
});

router.get('/thanks/:orderid', (req, res, next) => {
  res.render('thanks', {
    title: 'Ferris Acres Creamery',
    order: req.params.orderid
  });
});

router.get('/test', (req, res, next) => {
  res.render('test', {
    stylesheet: 'stylesheets/style.css',
    vueFiles: ['javascripts/manifest.js', 'javascripts/vendor.js', 'javascripts/app.js']
  });
});

module.exports = router;
