const express = require('express');
const userCtrl = require('../controllers/userCtrl.js');
const router = express.Router();

router.post('/users', (req, res, next) => {
  res.json(req.body);
  userCtrl.createUser(req, res);
});

module.exports = router;
