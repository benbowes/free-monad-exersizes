const express = require('express');
const oldSchoolRoute = require('./routes/listings/old-school');

const server = express();

server.use('/', oldSchoolRoute);
server.get('*', (req, res) => res.status(404).send());

server.listen(3005, (err) => {
  if (err) throw err;
  console.log('Ready on http://localhost:3005');
});

module.exports = server;
