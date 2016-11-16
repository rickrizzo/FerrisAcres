const express = require('express');
const router = express.Router();

const pg = require('pg');
const config = {
  database: 'ferris_acres',
  host: 'localhost',
  port: '5432'
}

router.post('/users', (req, res, next) => {
  res.json(req.body);
});

module.exports = router;
