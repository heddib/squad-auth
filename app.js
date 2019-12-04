require('rootpath')()
const express = require('express')
const app = express()
var morgan = require('morgan')
var sql = require("./db");
const cors = require('cors')
const bodyParser = require('body-parser')
const basicAuth = require('_helpers/basic-auth')
const errorHandler = require('_helpers/error-handler')

app.use(morgan('combined'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// Make our db accessible to our router
app.use(function(req, res, next) {
    req.sql = sql;
    next();
});

// use basic HTTP auth to secure the api
app.use(basicAuth)

// api routes
app.use('/users', require('./users/users.controller'))

// global error handler
app.use(errorHandler)

app.disable("x-powered-by");

module.exports = app;