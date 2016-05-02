var mongoose = require("mongoose");
var ppLocalMg = require("passport-local-mongoose");

// Schema definition
var userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Adds a username, hash and salt field to store the username, 
// the hashed password and the salt value 
userSchema.plugin(ppLocalMg);

module.exports = mongoose.model("user", userSchema);
