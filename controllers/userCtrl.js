const db = require('../controllers/db.js');

const insert_user = 'INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) ON CONFLICT (email) DO UPDATE SET name = $1, phone = $3 RETURNING user_id;';
const select_all_user = 'SELECT * FROM users;';
const select_user_by_id = 'SELECT * FROM users WHERE user_id = $1;';

function parsePhoneNumber(phone_number) {
  phone_number = phone_number.replace('(', '');
  phone_number = phone_number.replace(')', '');
  phone_number = phone_number.replace('-', '');
  phone_number = phone_number.replace(' ', '');
  return parseInt(phone_number);
}

module.exports = {
  createUser: function(req, res, next) {
    db.getConnection().any(insert_user, [req.body.name, req.body.email, parsePhoneNumber(req.body.phone)])
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
  getUserById: function(userid) {
    return db.getConnection().one(select_user_by_id, [userid]);
  }
}
