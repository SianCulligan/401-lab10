'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const Model = require('../models/model.js');
const userSchema = require('../models/users-schema.js');

//const badAuth = require('../middleware/auth.js');

const UserModel = new Model(userSchema);

const base64Decoder = (encodedString) => {
  let data = {
    username: '',
    password: '',
  };
  let decodedString = Buffer.from(encodedString, 'base64').toString();
  let dataPieces = decodedString.split(':');
  console.log('SPLIT DECODED STRING', dataPieces);
  data.username  = dataPieces[0];
  data.password  = dataPieces[1];
  console.log('BUFFER', Buffer);
  return data;
};

//TWO SIGN UP POST ROUTES, ONE THROUGH REQ.BODY, THE OTHER REQ.HEADERS.AUTHORIZATION - KEEP BOTH FOR REFERENCE

// POST/CREATE A USER
/**
 * This route allows you to CREATE a user from the request body
 * @route POST /signup-body
 * @group signups
 * @returns {object} 200 - The created a user in the array
 * @returns {error} - if there was an issue creating a user
 */
router.post('/signup-body', async (req, res, next) => {
  let user = await UserModel.create(req.body);
  res.send(user);
});


// POST/CREATE A USER
/**
 * This route allows you to CREATE a user from the header
 * @route POST /signup-headers
 * @group signups
 * @returns {object} 200 - The created a user in the array
 * @returns {error} - if there was an issue creating a user
 */
router.post('/signup-headers', async (req, res, next) => {
  let basicAuth = req.headers.authorization.split(' ');
  if (basicAuth.length === 2 && basicAuth[0] === 'Basic') {
    let userData = base64Decoder(basicAuth[1]);
    let user = await UserModel.create({ ...userData, ...req.body });
    res.send(user);
  }
  res.end();
});

// POST/ USER INFO
/**
 * This route allows a user to sign in
 * @route POST /signin
 * @group signin
 * @returns {object} 200 - The created a user in the array
 * @returns {error} - if there was an issue finding a user
 */
router.post('/signin', async (req, res, next) => {
  let basicAuth = req.headers.authorization.split(' ');

  if (basicAuth.length ===2 && basicAuth[0] === 'Basic' ) {
    let userData = base64Decoder(basicAuth[1]);
    let possibleUsers = await UserModel.readByQuery({
      username: userData.username,
    });
    for (let i = 0; i < possibleUsers.length; i++) {
      let isSame = await bcrypt.compare(
        userData.password,
        possibleUsers[i].password,
      );
      if (isSame) {
        // eslint-disable-next-line require-atomic-updates
        req.user = possibleUsers[i];
        break;
      }}
    if (req.user) {
      res.status(200);
      res.send('found!');
    } else {
      next({ status: 401, message: 'Unauthorized' });
    }}
  res.end();
});

router.get('/users', async (req, res, next) => {
  let users = await UserModel.readByQuery(req.body);
  res.send(users);
  console.log('RESULTS OF READ ALL', users);
  res.status(200);
  res.send(users);
});
  




module.exports = router;