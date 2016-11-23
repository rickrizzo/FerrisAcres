const pg = require('pg');
pg.defaults.ssl = true;
pg.defaults.database = process.env.DATABASE_NAME || 'ferris_acres';

module.exports = {
  createUser: function(req, res) {
    req.body.phone = req.body.phone.replace("(", "");
    req.body.phone = req.body.phone.replace(")", "");
    req.body.phone = req.body.phone.replace("-", "");
    req.body.phone = req.body.phone.replace(" ", "");
    req.body.phone = parseInt(req.body.phone);
    pg.connect(process.env.DATABASE_URL || 'localhost', (err, client) => {
      if (err) throw err;
      client.query('INSERT INTO users (name, email, phone) VALUES ($1, $2, $3);', [req.body.name, req.body.email, req.body.phone], (err, result) => {
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
