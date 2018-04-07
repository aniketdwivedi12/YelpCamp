var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware=require("../middleware");

//INDEX: Displays all campgrounds 
router.get("/", function(req, res){
    Campground.find({}, function(err, campgrounds){
       if(err){
           console.log(err);
       }
       else{
            res.render("campgrounds/index", {campgrounds: campgrounds});
       }
    });
});
 
//CREATE: create new object and inserts it into the DB 
router.post("/",middleware.isLoggedIn, function(req, res){
    var name = req.body.name,
        img  = req.body.image,
        desc = req.body.description;
    var author= {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {
        name: name,
        image: img,
        description: desc,
        author: author
    };
    Campground.create(newCampground, function(err, campground){
       if(err){
           console.log(err);
       } else{
            res.redirect("/campgrounds"); 
       }
    });
});
 
//NEW
router.get("/new",middleware.isLoggedIn, function(req, res){   
   res.render("campgrounds/new");   
});
 
//SHOW
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, campground){
        if(err){
            console.log(err);
        }else{
                res.render("campgrounds/show", {campground: campground}); 
        }
    });
}); 

//EDIT 
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findById(req.params.id,function(err,foundCampground){
    res.render("campgrounds/edit",{campground:foundCampground});
  });
});

//UPDATE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds/"+req.params.id);
    }
  });
});

//DELETE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
  Campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/campgrounds");
    }else{
      res.redirect("/campgrounds");
    }
  });            
});

module.exports = router;