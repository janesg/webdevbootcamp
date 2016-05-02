var mongoose = require("mongoose");

// Schema definition
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        // ref must exactly match model name:
        //      mongoose.model("comment", commentSchema);
        ref: "comment"  
    }]
});

// Results in a collection name that is plural version of parameter
// i.e. "campground" results in campgrounds collection
module.exports = mongoose.model("campground", campgroundSchema);
