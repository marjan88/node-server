const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express(); // instance of express
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

// DB SETUP
mongoose.connect('mongodb://localhost:auth/auth');

// APP SETUP
app.use(morgan('combined')); // middleware in express, any incoming requrest will be passed into morgan (morgan is login framework)
app.use(cors()); // use cors middleware for cros origine
app.use(bodyParser.json({ type: '*/*' })); // middleware that is parsing incoming request (into in json), it will do so no matter what the request type is (type:*/*)
router(app);

// SERVER SETUP
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);

console.log('Server listening on:', port);