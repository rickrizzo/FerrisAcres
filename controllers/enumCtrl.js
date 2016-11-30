const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/ferris_acres');

const select_all_cake_types = 'SELECT unnest(enum_range(NULL::CAKE_TYPE));';
const select_all_cake_sizes = 'SELECT unnest(enum_range(NULL::CAKE_SIZE));';
const select_all_colors = 'SELECT unnest(enum_range(NULL::COLOR));';

module.exports = {
  getCakeTypes: function(req, res, next) {
    db.any(select_all_cake_types)
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved all cake types'
      });
    })
    .catch(error => {
      return next(error);
    })
  },
  getCakeSizes: function(req, res, next) {
    db.any(select_all_cake_sizes)
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'Retrieved all cake sizes'
      });
    })
    .catch(error => {
      return next(error);
    })
  },
  getColors: function(req, res, next) {
    db.any(select_all_colors)
    .then(data => {
      res.status(200).json({
        status: 'success',
        data: data[0].enum_range,
        message: 'Retrieved all colors'
      });
    })
    .catch(error => {
      return next(error);
    })
  }
}
