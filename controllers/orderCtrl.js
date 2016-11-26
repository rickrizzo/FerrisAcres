const pg = require('pg');
if(process.env.DATABASE_URL) {
    pg.defaults.ssl = true;
}
pg.defaults.database = process.env.DATABASE_NAME || 'ferris_acres';

module.exports = {
  createOrder: function(user, cake, req, res) {
    pg.connect(process.env.DATABASE_URL || 'ferris_acres', (err, client) => {
      if (err) throw err;
      client.query(
        'INSERT INTO orders (user_id, pickup, cake_id, instructions) ' +
        'VALUES ($1, $2, $3, $4);',
        [1, req.body.pickup, 1, req.body.instructions], (err, result) => {
        if (err) {
          if(err.message.includes('duplicate key')) {
            console.log("Duplicate key");
          }
          console.log("Error: ", err);
        }
        client.end((err) => { if (err) console.log("Error: ", err); });
      });
    });
  }
}
