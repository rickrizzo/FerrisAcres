const express = require('express');
const router = express.Router();
const pg = require('pg');
const config = {
  database: 'ferris_acres',
  host: 'localhost',
  port: '5432'
}

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Express' });
});

router.get('/create_table', (req, res, next) => {
  const client = new pg.Client(config);
  client.connect((err) => {
    if (err) throw err;

    client.query('CREATE TABLE lastTestPoop (col char(5))', (err, result) => {
      if (err) throw err;
      console.log(result.rows[0]);
      client.end((err) => {
        if (err) throw err;
      });
    });
  });

  res.end("Connected!");
});

module.exports = router;
