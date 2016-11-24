const express = require('express');
const router = express.Router();

/* GET Home Page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Ferris Acres Creamery'});
});

/* GET Cake Order Form */
router.get('/order', (req, res, next) => {
  res.render('cake_order.pug', {
    title: 'Ferris Acres Creamery',
    sizes: [
      {'name':'6_Round', 'display_name': '6" Round', 'price':14.5},
      {'name':'8_Round', 'display_name': '8" Round', 'price':20},
      {'name':'10_Round', 'display_name': '8" Round','price':27},
      {'name':'Sheet', 'display_name': 'Sheet', 'price':37},
      {'name':'Heart', 'display_name': 'Heart', 'price':18.5}
    ],
    fillings: [
      {'name':'Cake Crunch', 'price':0},
      {'name':'Oreos', 'price':2},
      {'name':'Chocolate Chunks', 'price':2},
      {'name':'Fudge', 'price':2},
      {'name':'Mini Chocolate Chips', 'price':2}
    ],
    pickup: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
  });
});

module.exports = router;
