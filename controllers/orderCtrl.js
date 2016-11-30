const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/ferris_acres');

const insert_user = 'INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET name = $1, phone = $3 RETURNING user_id;';
const insert_cake = 'INSERT INTO cakes (type, size, fillings, art_description, color_one, color_two, writing, writing_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING cake_id;';
const insert_order = 'INSERT INTO orders (user_id, pickup, cake_id, instructions) VALUES ($1, $2, $3, $4) RETURNING order_id;';

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
      let user = yield t.one(insert_user, [req.body.name, req.body.email, parsePhoneNumber(req.body.phone)]);
      let cake = yield t.one(insert_cake, [req.body.type, req.body.size, req.body.fillings, req.body.art_description, req.body.color_one, req.body.color_two, req.body.writing, req.body.writing_color]);
      return yield t.any(insert_order, [user.user_id, req.body.pickup, cake.cake_id, req.body.instructions]);
    })
    .then(data => {
      res.status(200).json({
        status: 'success',
        message: 'order created'
      })
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
