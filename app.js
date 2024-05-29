const config = require('./utils/config');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const logger = require('./utils/logger');
const Router = require('./controllers/router');
const middleware = require('./utils/middleware');
const cors = require('cors');

app.use(bodyParser.json());
// accept frontend POST and GET request, https://ziqingfeng.vercel.app is front end website address
app.use(cors(
  {
    origin: ["https://ziqingfeng.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true
  },
  {
    origin: ["https://ziqingfeng-v2.vercel.app"],
    methods: ["POST", "GET"],
    credentials: true
  }
));
// //local test code
// //前端的local网址 http://localhost:3001
// app.use(cors(
//   {
//     origin: ["http://localhost:3001"],
//     methods: ["POST"],
//     credentials: true
//   }
// ));

app.use('/', Router);

// handler of requests with unknown endpoint
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;