const db = require('../controllers/db.js');

const authenticate_user = 'SELECT EXISTS(SELECT * FROM users WHERE email = $1 AND password = crypt($2, password));';

module.exports = {
  validateUser: function(req, res, next) {
    return db.getConnection().one(authenticate_user, [req.body.username, req.body.password]);
  }
}