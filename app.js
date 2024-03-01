const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const expressLayouts = require('express-ejs-layouts');
const nocache = require('nocache');
const morgan = require('morgan');
const routes = require('./routes');

// mongodb, passportjs


const app = express();

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Middleware for session configuration
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
}));

// Template engine
app.use(expressLayouts)
app.set('layout', './layouts/indexLayout.ejs')
app.set('view engine', 'ejs')


// Middleware for flash messages
app.use(flash());
app.use(nocache());
app.use(morgan('dev'));

// Mount the routes from the separate router file
app.use('/', routes);

// Custom middleware to expose flash messages to views
app.use((req, res, next) => {
  res.locals.successMessage = req.flash('successMessage');
  res.locals.errorMessage = req.flash('errorMessage');
  next();
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000\n http://localhost:3000');
});