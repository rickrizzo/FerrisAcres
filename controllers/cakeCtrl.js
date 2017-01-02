const db = require('../controllers/db.js');

const insert_cake = 'INSERT INTO cakes (type, size, fillings, art_description, flavor_one, flavor_two, color_one, color_two, writing, writing_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING cake_id;';
const select_all_cake = 'SELECT * FROM cakes;';
const select_id_cake = 'SELECT * FROM cakes WHERE cake_id IN ';

function formatFillings(fillings) {
  if (fillings == null) { return fillings; }
  if (typeof fillings == "string") { return '{"' + fillings + '"}'; }
  return '{"' + fillings.join('","') + '"}';
}

module.exports = {
  createCake: function(req, res, next) {
    return db.getConnection().any(insert_cake, [req.body.type, req.body.size, formatFillings(req.body.fillings), req.body.art_description, req.body.flavor_one, req.body.flavor_two, req.body.color_one, req.body.color_two, req.body.writing, req.body.writing_color]);
  },
  // getCakes: function(req, res, next) {
  //   db.getConnection().any(select_all_cake)
  //   .then(data => {
  //     res.status(200).json({
  //       status: 'success',
  //       data: data,
  //       message: 'Retrieved all cakes'
  //     });
  //   })
  //   .catch(error => {
  //     return next(error);
  //   })
  // },
  getCakesById: function(ids) {
    return db.getConnection().any(select_id_cake + '(' + ids.join() + ');');
  }
}
