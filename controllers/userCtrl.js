const pg = require('pg');
if(process.env.DATABASE_URL) {
    pg.defaults.ssl = true;
}
pg.defaults.database = process.env.DATABASE_NAME || 'ferris_acres';

function parsePhoneNumber(phone_number) {
  phone_number = phone_number.replace("(", "");
  phone_number = phone_number.replace(")", "");
  phone_number = phone_number.replace("-", "");
  phone_number = phone_number.replace(" ", "");
  return parseInt(phone_number);
}

module.exports = {
  createUser: function(req, res) {
    pg.connect(process.env.DATABASE_URL || 'ferris_acres', (err, client) => {
      if (err) throw err;
      var query = client.query('INSERT INTO users (name, email, phone) VALUES ($1, $2, $3) RETURNING user_id;', [req.body.name, req.body.email, parsePhoneNumber(req.body.phone)], (err, result) => {
        if (err) {
          if(err.message.includes('duplicate key')) {
            console.log("Duplicate key");
          }
          console.log("Error: ", err);
        }
      });
      query.on('end', function(result) {
        client.end();
        // res.write(result.rows[0]);
      });
    });
  }
}
