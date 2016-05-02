var mongoose    = require("mongoose"),
    Comment     = require("./models/comment"),
    Campground  = require("./models/campground");

var data = [
    { name : "Shitesville", 
      image : "https://farm3.staticflickr.com/2789/4176189296_c51043f23b.jpg", 
      description : "The path of the righteous man is beset on all sides by the iniquities of the selfish and the tyranny of evil men. Blessed is he who, in the name of charity and good will, shepherds the weak through the valley of darkness, for he is truly his brother's keeper and the finder of lost children. And I will strike down upon thee with great vengeance and furious anger those who would attempt to poison and destroy My brothers. And you will know My name is the Lord when I lay My vengeance upon thee."
    },
    { name : "Nowhere City, Arizona", 
      image : "https://images.unsplash.com/photo-1445308394109-4ec2920981b1",
      description : "Now that we know who you are, I know who I am. I'm not a mistake! It all makes sense! In a comic, you know how you can tell who the arch-villain's going to be? He's the exact opposite of the hero. And most times they're friends, like you and me! I should've known way back when... You know why, David? Because of the kids. They called me Mr Glass."
    },
    { name : "Mingin Meadows", 
      image : "https://images.unsplash.com/photo-1444228250525-3d441b642d12", 
      description : "You think water moves fast? You should see ice. It moves like it has a mind. Like it knows it killed the world once and got a taste for murder. After the avalanche, it took us a week to climb out. Now, I don't know exactly when we turned on each other, but I know that seven of us survived the slide... and only five made it out. Now we took an oath, that I'm breaking now. We said we'd say it was the snow that killed the other two, but it wasn't. Nature is lethal but it doesn't hold a candle to man."
    }    
]

function seedDB() {
    Comment.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all comments");
        }
    });
    
    Campground.remove({}, function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("Removed all campgrounds");
        }
        
        // By putting the creation inside the remove's callback
        // we ensure it happens after the remove completed successfully
        data.forEach(function(seed) {
            // Add some campground
            Campground.create(seed, function(err, campground) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Created new campground");
                    
                    Comment.create(
                        {
                            text: "This place is a really 'kin great",
                            author: "Little Bob"
                        }, function(err, comment) {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log("Created new comment");
                                
                                // Associate it with the campground
                                campground.comments.push(comment);
                                campground.save();
                            }
                        }
                    );
                }
            }); 
        });
    });
}

module.exports = seedDB;