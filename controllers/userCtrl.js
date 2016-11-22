const pg = require('pg');
pg.defaults.ssl = true;
pg.defaults.database = 'd2nic9l1t6vto2'
console.log(pg.defaults);
// const config = {
//   database: 'ferris_acres',
//   host: process.env.DATABASE_URL || 'localhost',
//   port: '5432',
//   ssl: true
// }
// const client = new pg.Client(config);

module.exports = {
  createUser: function(req, res) {
    req.body.phone = req.body.phone.replace("(", "");
    req.body.phone = req.body.phone.replace(")", "");
    req.body.phone = req.body.phone.replace("-", "");
    req.body.phone = req.body.phone.replace(" ", "");
    req.body.phone = parseInt(req.body.phone);
    pg.connect(process.env.DATABASE_URL || 'localhost', (err, client) => {
      console.log(process.env.DATABASE_URL);
      if (err) throw err;
      console.log("CONNECTED TO POSTGRES!");
    });
  }


  //   client.connect((err) => {
  //     if (err) { console.log("Error!", err); return; }
  //     client.query('INSERT INTO users (name, email, phone) VALUES ($1, $2, $3);', [req.body.name, req.body.email, req.body.phone], (err, result) => {
  //       if (err) {
  //         if(err.message.includes('duplicate key')) {
  //           console.log("Duplicate key");
  //         }
  //         console.log("Error!", err);
  //       }
  //       client.end((err) => { if (err) console.log("Error!", err); });
  //     });
  //   });
  //   res.json(req.body);
  // }
}
