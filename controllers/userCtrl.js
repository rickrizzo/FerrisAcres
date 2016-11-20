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
      client.query('INSERT INTO users (name, email, phone) VALUES (\''
      + req.body.name + '\',\'' +
      + req.body.email + '\',' +
      + req.body.phone + ');', (err, result) => {
        if (err) {
          if(err.message.includes('duplicate key')) {
            console.log("DUPLICATE KEY");
          } else {
            console.log("Error!", err.message);
            return;
          }
        }
        client.end((err) => { console.log("Error!", err); return; });
      });
    });

    res.json(req.body);
  }
}
