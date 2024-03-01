const express = require("express");
const router = express.Router();

// Middleware to check if the user is logged in
function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    // User is logged in, proceed to the next middleware
    next();
  } else {
    // User is not logged in, redirect to the login page with an error message
    req.flash("errorMessage", "Please log in to access the page.");
    res.redirect("/login");
  }
}

const isLoggedOut = (req,res,next) => {
  if (req.session && req.session.user) {
    // User is logged in, redirect to the login page
    res.redirect("/");
  } else {
    // User is not logged in, redirect to the login page with an error message
    next();
  }
}

const credentials = {
  username: "Tawfiq",
  password: "admin@123",
};

// Login page
router.get("/login", isLoggedOut,(req, res) => {
  const locals = {
    title: 'Login Page'
  }

  res.render("login", {
    locals, 
    errorMessage: req.flash("errorMessage"), 
    successMessage: req.flash("successMessage") 
  });
});

// Login endpoint (handles form submission)
router.post("/login", (req, res) => {
  // Perform login authentication here
  // Example: Check if the credentials are valid

  if (req.body) {
    const { username, password } = req.body;

    if (username === credentials.username) {
      if (password === credentials.password) {
        // Set a success flash message
        req.flash("successMessage", "You have successfully logged in.");
        
        // Assuming authentication is successful, store the user in the session
        req.session.user = username ;

        // Redirect to the home page
        res.redirect("/");

      }
    } else {
      req.flash("errorMessage", "Invalid Username or Please Fill");
      res.redirect("/login");
    }
  } else {
    req.flash("errorMessage", "Please enter username and password");
    res.redirect("/login");
  }
});

// Logout endpoint
router.get("/logout", (req, res) => {

  // Set a success flash message
  req.flash("successMessage", "You have been logged out.");
  
  // Clear the user session
  req.session.destroy();
  

  // Redirect to the login page
  res.redirect("/login");
});

// Home page (requires authentication)
router.get("/", isAuthenticated, (req, res) => {

  const locals = {
    title: 'Home Page'
  }

  console.log(req.session.user);
  
  res.render("index", { 
    locals,
    successMessage: req.flash("successMessage"),
    user : req.session.user
  });
});

module.exports = router;