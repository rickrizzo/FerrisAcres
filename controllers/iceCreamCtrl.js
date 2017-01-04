const db = require('../controllers/db.js');

const insert_ice_cream = 'INSERT INTO ice_cream (size, flavor, quantity) VALUES ($1, $2, $3) RETURNING ice_cream_id;';
const select_id_ice_cream = 'SELECT * FROM ice_cream WHERE ice_cream_id IN ';

module.exports = {
  createIceCream: function(req, res, next) {
    return db.getConnection().any(insert_ice_cream, [req.body.size, req.body.flavor, req.body.quantity]);
  },
  getIceCreamsById: function(ids) {
    return db.getConnection().any(select_id_ice_cream + '(' + ids.join() + ');');
  }
}
