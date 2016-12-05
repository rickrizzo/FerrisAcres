const express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const router = express.Router();
const cakeCtrl = require('../controllers/cakeCtrl.js');

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
      fillings: [
          {'name':'Cake Crunch', 'price':0},
          {'name':'Oreos', 'price':2},
          {'name':'Chocolate Chunks', 'price':2},
          {'name':'Fudge', 'price':2},
          {'name':'Mini Chocolate Chips', 'price':2}
        ],
      colors: enums.colors
    })
  });
});

router.get('/icecream', (req, res, next) => {
  res.render('ice_cream_order', {title: 'Ferris Acres Creamery'});
});

router.get('/admin', (req, res, next) => {
  res.render('admin', {title: 'Ferris Acres Creamery'});
});

router.get('/cart', (req, res, next) => {
  if(req.cookies.ferrisacres) {
    var cert = fs.readFileSync('private.key', 'utf-8');
    var token = jwt.verify(req.cookies.ferrisacres, cert);
    cakeCtrl.getCakesById(token.cake).then( data => {
      res.render('cart', {
        title: 'Ferris Acres Creamery',
        order: data,
        pickup: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0,11) + '12:00'
      });
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
  res.render('order', {title: 'Ferris Acres Creamery'});
});

router.get('/thanks/:orderid', (req, res, next) => {
  res.render('thanks', {
    title: 'Ferris Acres Creamery',
    order: req.params.orderid
  });
})

module.exports = router;
