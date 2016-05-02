var express     = require("express"),
    mongoose    = require("mongoose"),
    bodyParser  = require("body-parser"),
    passport    = require("passport"),
    ppLocal     = require("passport-local"),
    override    = require("method-override"),
    flash       = require("connect-flash"),
    seedDB      = require("./seeds"),
    User        = require("./models/user"),
    app         = express();

// Pull in routes
var campgroundRoutes    = require("./routes/campgrounds"),
    commentRoutes       = require("./routes/comments"),
    indexRoutes         = require("./routes/index");
    
mongoose.connect(process.env.DATABASEURL);

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(override("_method"));
app.use(flash());
app.set("view engine", "ejs");

// Seed database
//seedDB();

// Passport Configuration
app.use(require("express-session")({
    secret: "Very secret squirrel...which could be anything",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Wire together Passport and augmented User model
passport.use(new ppLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Custom middleware that runs for every route
// Make logged in user and flash values available to all templates
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
})

// Use routes
app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp server started successfully...");
});