const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/ferris_acres');

const insert_cake = 'INSERT INTO cakes (type, size, fillings, art_description, color_one, color_two, writing, writing_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING cake_id;';
const select_all_cake = 'SELECT * FROM cakes;';

module.exports = {
  createCake: function(req, res, next) {
    return db.any(insert_cake, [req.body.type, req.body.size, req.body.fillings, req.body.art_description, req.body.color_one, req.body.color_two, req.body.writing, req.body.writing_color])
  },
  getCakes: function(req, res, next) {
    db.any(select_all_cake)
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved all cakes'
      });
    })
    .catch(error => {
      return next(error);
    })
  }
}
