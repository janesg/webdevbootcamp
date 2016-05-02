var express     = require("express"),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    // requiring a directory automatically uses index.js so no need to specify
    middleware  = require("../middleware");

// Ensure campground's :id parameter passed through to comment routes
var router = express.Router({mergeParams: true});

// CREATE : add comment for particular campground to DB
//        : use a middleware to ensure authenticated user
router.post("/", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, cg){
        if (err) {
            console.log(err);
            res.redirect("/campgrounds/");
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    cg.comments.push(comment);
                    cg.save();
                    req.flash("success", "Comment added successfully");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            });
        }
    });
});

// NEW : displays form for creating comment for a particular campground
//     : use a middleware to ensure authenticated user
router.get("/new", middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, camp) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {campground: camp});
        }
    });
})

// EDIT : displays comment edit form
router.get("/:comment_id/edit", middleware.isCommentOwner, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, c) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit", {campground_id: req.params.id, comment: c});
        }
    });
});

// UPDATE : updates details of given comment
router.put("/:comment_id", middleware.isCommentOwner, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, c) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment updated successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

// DESTROY : deletes given comment
router.delete("/:comment_id", middleware.isCommentOwner, function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err) {
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

module.exports = router;