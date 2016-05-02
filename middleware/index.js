var Campground  = require("../models/campground"),
    Comment     = require("../models/comment");

var middlewareObj = {};

// Define a middleware for authentication checking
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    
    req.flash("error", "Please login before proceeding");
    res.redirect("/login");
}

middlewareObj.isCampgroundOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, cg){
            if (err) {
                req.flash("error", "Campground not found");
                res.redirect("back");
            // have to use .equals as author.id is a mongoose object
            } else if (cg.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash("error", "You do not have permission");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "Please login before proceeding");
        res.redirect("back");
    }
}

middlewareObj.isCommentOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, c){
            if (err) {
                req.flash("error", "Comment not found");
                res.redirect("back");
            // have to use .equals as author.id is a mongoose object
            } else if (c.author.id.equals(req.user._id)) {
                return next();
            } else {
                req.flash("error", "You do not have permission");
                res.redirect("back");
            }
        });
    } else {
        req.flash("error", "Please login before proceeding");
        res.redirect("back");
    }
}

module.exports = middlewareObj;