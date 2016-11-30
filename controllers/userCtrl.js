const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/ferris_acres');

const insert_user = 'INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET name = $1, phone = $3 RETURNING user_id;';
const select_all_user = 'SELECT * FROM users;';

function parsePhoneNumber(phone_number) {
  phone_number = phone_number.replace('(', '');
  phone_number = phone_number.replace(')', '');
  phone_number = phone_number.replace('-', '');
  phone_number = phone_number.replace(' ', '');
  return parseInt(phone_number);
}

module.exports = {
  createUser: function(req, res, next) {
    db.any(insert_user, [req.body.name, req.body.email, parsePhoneNumber(req.body.phone)])
    .then(events => {
      res.status(200).json({
        status: 'success',
        message: 'user created'
      })
    })
    .catch(error => {
      return next(error);
    });
  },
  getUsers: function(req, res, next) {
    db.any(select_all_user)
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved all users'
      });
    })
    .catch(error => {
      return next(error);
    })
  }
}
