const pg = require('pg');
const config = {
  database: 'ferris_acres',
  host: 'localhost',
  port: '5432'
}

const client = new pg.Client(config);

module.exports = {
  createUser: function(req, res) {
    req.body.phone = req.body.phone.replace("(", "");
    req.body.phone = req.body.phone.replace(")", "");
    req.body.phone = req.body.phone.replace("-", "");
    req.body.phone = req.body.phone.replace(" ", "");
    req.body.phone = parseInt(req.body.phone);
    client.connect((err) => {
      if (err) { console.log("Error!", err); return; }
      client.query('INSERT INTO users (name, email, phone) VALUES ($1, $2, $3);', [req.body.name, req.body.email, req.body.phone], (err, result) => {
        if (err) {
          if(err.message.includes('duplicate key')) {
            console.log("Duplicate key");
          }
          console.log("Error!", err);
        }
        client.end((err) => { if (err) console.log("Error!", err); });
      });
    });
    res.json(req.body);
  }
}
