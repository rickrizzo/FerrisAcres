const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL || 'postgres://localhost:5432/ferris_acres');

module.exports = {
  getConnection: function() {
    return db;
  }
}
