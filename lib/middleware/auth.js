'use strict';


const badAuth = ( req, res, next) => {
  res.status(403);
  res.statusMessage('Forbidden!!');
  res.end();
};

module.exports = badAuth;