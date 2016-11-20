const express = require('express');
const userCtrl = require('../controllers/userCtrl.js');
const router = express.Router();

const pg = require('pg');
const config = {
  database: 'ferris_acres',
  host: 'localhost',
  port: '5432'
}

router.post('/users', (req, res, next) => {
  userCtrl.createUser(req, res);
});

module.exports = router;
