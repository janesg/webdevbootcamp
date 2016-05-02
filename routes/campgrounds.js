var express     = require("express"),
    Campground  = require("../models/campground"),
    // requiring a directory automatically uses index.js so no need to specify
    middleware  = require("../middleware");

var router = express.Router();

// INDEX : list all campground
router.get("/", function(req, res) {
    Campground.find({}, function(err, allCamps) {
        if (err) {
            console.log("Failed to retrieve campgrounds: " + err);
        } else {
            // Handle possibility of empty collection
            res.render("campgrounds/index", {camps: (allCamps ? allCamps : [])});        
        }
    });
})

// CREATE : add campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    
    Campground.create({
        name: req.body.name, 
        image: req.body.image,
        description: req.body.description,
        author: author
    }, function(err, camp) {
        if (err) {
            console.log("Failed to create campground: " + err);
        } else {
            req.flash("success", "Campground added successfully");
            res.redirect("/campgrounds");
        }
    });
});

// NEW : displays form for creating campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
})

// SHOW : displays details of 1 campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, cg){
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/show", {campground: cg});
        }
    });
})

// EDIT : displays edit form
router.get("/:id/edit", middleware.isCampgroundOwner, function(req, res) {
    Campground.findById(req.params.id, function(err, cg) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {campground: cg});
        }
    });
});

// UPDATE : updates details of given campground
router.put("/:id", middleware.isCampgroundOwner, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, cg) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground updated successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
})

// DESTROY : deletes given campground
router.delete("/:id", middleware.isCampgroundOwner, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Campground deleted successfully");
            res.redirect("/campgrounds");
        }
    });
})

module.exports = router;