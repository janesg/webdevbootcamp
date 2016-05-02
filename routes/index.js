var express     = require("express"),
    passport    = require("passport"),
    User        = require("../models/user");

var router = express.Router();

// Root route
router.get("/", function(req, res) {
    res.render("landing");
});

// ================= Authentication routes =================

router.get("/register", function(req, res) {
   res.render("register"); 
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            req.flash("error", err.message);
            return res.render("register");
        } 
        
        // Not sure about this syntax..it works but 
        // what function is being invoked and how !!
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Welcome to YelpCamp, " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login"); 
});

router.post("/login", 
    passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res) {
});

router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "You successfully logged out");
    res.redirect("/campgrounds"); 
});

module.exports = router;