const pgp = require('pg-promise')();
const jwt = require('jsonwebtoken');
const fs = require('fs');
const db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/ferris_acres');

const insert_user = 'INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET name = $1, phone = $3 RETURNING user_id;';
const insert_cake = 'INSERT INTO cakes (type, size, fillings, art_description, color_one, color_two, writing, writing_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING cake_id;';
const insert_order = 'INSERT INTO orders (user_id, pickup, cake_id, ice_cream_id, instructions) VALUES ($1, $2, $3, $4, $5) RETURNING order_id;';

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
    db.any(get_all_order)
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved all orders'
      });
    })
    .catch(error => {
      return next(error);
    });
  }
}
