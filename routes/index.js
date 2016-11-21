const express = require('express');
const router = express.Router();

/* GET Home Page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Ferris Acres Creamery' });
});

/* GET Cake Order Form */
router.get('/order', (req, res, next) => {
  res.render('cake_order.pug', { title: 'Ferris Acres Creamery' });
});

module.exports = router;
