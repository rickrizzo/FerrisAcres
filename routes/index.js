const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('index', {
    title: 'Ferris Acres Creamery'
  });
});

router.get('/cake', (req, res, next) => {
  fs.readFile('enum/enums.json', function(err, enums) {
    if (err) throw err;
    enums = JSON.parse(enums);
    res.render('cake_order', {
      title: 'Ferris Acres Creamery',
      sizes: enums.cake_sizes,
      fillings: [
          {'name':'Cake Crunch', 'price':0},
          {'name':'Oreos', 'price':2},
          {'name':'Chocolate Chunks', 'price':2},
          {'name':'Fudge', 'price':2},
          {'name':'Mini Chocolate Chips', 'price':2}
        ],
        colors: enums.colors
        // pickup: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
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
  res.render('cart', {title: 'Ferris Acres Creamery'});
});

router.get('/checkout', (req, res, next) => {
  res.render('checkout', {title: 'Ferris Acres Creamery'});
});

router.get('/order', (req, res, next) => {
  res.render('order', {title: 'Ferris Acres Creamery'});
});

module.exports = router;
