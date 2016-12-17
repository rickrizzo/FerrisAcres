const pgp = require('pg-promise')();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/ferris_acres');

const userCtrl = require('../controllers/userCtrl.js');
const cakeCtrl = require('../controllers/cakeCtrl.js');
const iceCreamCtrl = require('../controllers/iceCreamCtrl.js');

const insert_user = 'INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET name = $1, phone = $3 RETURNING user_id;';
const insert_order = 'INSERT INTO orders (user_id, pickup, cake_id, ice_cream_id, instructions) VALUES ($1, $2, $3, $4, $5) RETURNING order_id;';

const get_order_by_id = 'SELECT * FROM orders WHERE order_id = $1;';
const get_all_order = 'SELECT * FROM orders';

function parsePhoneNumber(phone_number) {
  phone_number = phone_number.replace('(', '');
  phone_number = phone_number.replace(')', '');
  phone_number = phone_number.replace('-', '');
  phone_number = phone_number.replace(' ', '');
  return parseInt(phone_number);
}

module.exports = {
  createOrder: function(req, res, next) {
    db.task(function * (t) {
      var cert = fs.readFileSync('private.key', 'utf-8');
      var token = jwt.verify(req.cookies.ferrisacres, cert);
      if(token.cake.length == 0){ token.cake = null;}
      if(token.icecream.length == 0){ token.icecream = null;}
      let user = yield t.one(insert_user, [req.body.name, req.body.email, parsePhoneNumber(req.body.phone)]);
      return yield t.any(insert_order, [user.user_id, req.body.pickup, token.cake, token.icecream, req.body.instructions]);
    })
    .then(data => {
      res.clearCookie("ferrisacres").redirect('/thanks/' + data[0].order_id)
    })
    .catch(error => {
      return next(error);
    });
  },
  getOrders: function(req, res, next) {
    return db.any(get_all_order);
  },
  getOrderById: function(req, res, next) {
    db.one(get_order_by_id, [req.query.orderid]).then(order => {
      userCtrl.getUserById(order.user_id).then(user => {
        cakeCtrl.getCakesById(order.cake_id).then(cakes => {
          iceCreamCtrl.getIceCreamsById(order.ice_cream_id).then(icecreams => {
            res.render('order', {
              title: 'Ferris Acres Creamery',
              order: order,
              user: user,
              cakes: cakes,
              icecreams: icecreams
            });
          });
        });
      });
    });
  }
}
