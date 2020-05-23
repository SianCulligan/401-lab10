'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const schema = mongoose.Schema({
  username: { type: 'String', required: true, unique: true },
  password: { type: 'String', required: true },
  email: { type: 'String' },
  role: {type: 'String', required: true, default: 'user', enum: ['admin', 'editor', 'user']},
});

//pre-middleware
schema.pre('save', async function() {
  console.log(this);
  this.password =await bcrypt.hash(this.password, saltRounds);
});

module.exports = mongoose.model('users', schema);