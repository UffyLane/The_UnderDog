
const express = require('express');

const router = express.Router();

router.use((req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

module.exports = router;