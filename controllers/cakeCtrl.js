const pg = require('pg');
if(process.env.DATABASE_URL) {
    pg.defaults.ssl = true;
}
pg.defaults.database = process.env.DATABASE_NAME || 'ferris_acres';

module.exports = {
  createCake: function(req, res) {
    pg.connect(process.env.DATABASE_URL || 'ferris_acres', (err, client) => {
      if (err) throw err;
      var query = client.query(
        'INSERT INTO cakes (type, size, fillings, art_description, color_one, color_two, writing, writing_color) ' +
        'VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING cake_id;',
        [
          req.body.type,
          req.body.size,
          req.body.fillings,
          req.body.art_description,
          req.body.color_one, req.body.color_two,
          req.body.writing,
          req.body.writing_color
        ], (err, result) => {
        if (err) {
          if(err.message.includes('duplicate key')) {
            console.log("Duplicate key");
          }
          console.log("Error: ", err);
        }
      });
      query.on('row', function(row) {
        console.log(row);
        return row;
      });
      query.on('end', function(result) {
        client.end();
        // res.write(result.rows[0]);
      })
    });
  }
}
