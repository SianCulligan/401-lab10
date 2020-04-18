'use strict';

const express = require('express');
const morgan = require('morgan'); 
const cors = require('cors');
const mongoose= require('mongoose');

const authRouter = require('./routes/auth-routes.js');

const notFound = require('./middleware/404.js');
const errorHandler = require('./middleware/error-handler.js');
const badAuth = require('./middleware/auth.js');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res, next) => {
  res.send('Homepage');
});

app.use(authRouter);

//ERROR HANDLING HERE
app.use('*', notFound);
app.use(errorHandler);
app.use(badAuth);


module.exports = {
  server: app,
  start: (port, mongodb_uri) => {
    app.listen(port, () => {
      console.log('server is up and running on port', port);
    });
    let options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: true,
    };
    mongoose.connect(mongodb_uri, options);
  },
};