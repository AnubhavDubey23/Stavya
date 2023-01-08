// //jshint esversion:6
// require('dotenv').config();
// const express = require("express");
// const bodyParser = require("body-parser");
// const ejs = require("ejs");
// const mongoose = require("mongoose");
// const session = require('express-session');
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require('mongoose-findorcreate');



// // const multer = require('multer');
// // const path = require('path')

// // const upload = multer().single('chitrakalaEntries');



// mongoose.set('strictQuery', true);

// const app = express();

// app.use(express.static("public"));
// app.set('view engine', 'ejs');
// app.use(bodyParser.urlencoded({
//     extended: true
// }));

// app.use(session({
//     secret: "A little secret for website stavya.",
//     resave: false,
//     saveUninitialized: false
// }));

// app.use(passport.initialize());
// app.use(passport.session());

// mongoose.connect("mongodb://localhost:27017/userDB",{
//     useNewUrlParser: true
// });


// const userSchema = new mongoose.Schema({
//     name: String,
//     username: String,
//     userinstitutename: String,
//     userid: Number,
//     usernumber: Number,
//     password: String,
//     googleId: String,
//     secret: String
// });

// const tmkocSchema = new mongoose.Schema({
//     tmkocusername: String,
//     tmkocTname: String,
//     tmkocP2name: String,
//     tmkocP2id: Number
// });

// const foffSchema = new mongoose.Schema({
//     foffusername: String,
//     foffTname: String,
//     foffP2name: String,
//     foffP2id: Number
// });

// const chitrakalaSchema = new mongoose.Schema({
//     chitrakalausername: String,
//     chitrakalaSubmission1: String,
//     tagline1: String,
//     chitrakalaSubmission2: String,
//     tagline2: String,
//     inspiration: String
// });

// userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);
// tmkocSchema.plugin(findOrCreate);
// foffSchema.plugin(findOrCreate);
// chitrakalaSchema.plugin(findOrCreate);


// const User = new mongoose.model("User", userSchema);
// const TmkocParticipant = new mongoose.model("TmkocParticipant", tmkocSchema);
// const FoffParticipant = new mongoose.model("FoffParticipant", foffSchema);
// const ChitrakalaParticipant = new mongoose.model("ChitrakalaParticipant", chitrakalaSchema);

// passport.use(User.createStrategy());


// passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });
  
//   passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//       done(err, user);
//     });
//   });

// passport.use(new GoogleStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/secrets",
//     userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
//   },
//   function(accessToken, refreshToken, email, cb) {
    
//     const emailStr = JSON.stringify(email.emails);
//     const emailSubString = emailStr.substring(
//         emailStr.indexOf(":") + 2, 
//         emailStr.lastIndexOf(",") - 1
//     );
//     console.log(emailSubString);

//     User.findOrCreate({ googleId: email.id, name: email.displayName, username: emailSubString}, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));




// app.get("/", function(req, res){
//     // res.render("home");
//     if(req.isAuthenticated()){
//         res.render("home", {loginUserName: req.user.name});
//     } else {
//         res.render("home", {loginUserName: "Log in"});
//     }
// });



// app.get("/home", function(req, res){
//     // res.render("home");
//     if(req.isAuthenticated()){
//         res.render("home", {loginUserName: req.user.name});
//     } else {
//         res.render("home", {loginUserName: "Log in"});
//     }

// });

// app.get("/chitrakala_home", function(req, res){
//     // res.render("chitrakala_home");
//     // if(req.isAuthenticated()){
//     //     res.render("chitrakala_home", {loginUserName: req.user.name});
//     // } else {
//     //     res.render("chitrakala_home", {loginUserName: "Log in"});
//     // }
//     User.find({"secret": {$ne: null}}, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else {
//             if(foundUser){
//                 res.render("chitrakala_home", {loginUserName: req.user.name});
//                 console.log(req.user.name);
//             } else {
//                 res.redirect("/login");
//             }
//         }
//     });
// });

// app.get("/tmkoc_home", function(req, res){
//     User.find({"secret": {$ne: null}}, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else {
//             if(foundUser){
//                 res.render("tmkoc_home", {loginUserName: req.user.name});
//                 console.log(req.user.name);
//             } else {
//                 res.redirect("/login");
//             }
//         }
//     });
// });

// app.get("/chitrakala_home", function(req, res){
//     User.find({"secret": {$ne: null}}, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else {
//             if(foundUser){
//                 res.render("chitrakala_home", {loginUserName: req.user.name});
//                 console.log(req.user.name);
//             } else {
//                 res.redirect("/login");
//             }
//         }
//     });
// });

// app.get("/foff_home", function(req, res){
//     User.find({"secret": {$ne: null}}, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else {
//             if(foundUser){
//                 res.render("foff_home", {loginUserName: req.user.name});
//                 console.log(req.user.name);
//             } else {
//                 res.redirect("/login");
//             }
//         }
//     });
// });



// app.get("/culturalEvent", function(req, res){
//     // res.render("culturalEvent");
//     if(req.isAuthenticated()){
//         res.render("culturalEvent", {loginUserName: req.user.name});
//     } else {
//         res.render("culturalEvent", {loginUserName: "Log in"});
//     }
// });

// app.get("/literatureEvent", function(req, res){
//     // res.render("literatureEvent");
//     if(req.isAuthenticated()){
//         res.render("literatureEvent", {loginUserName: req.user.name});
//     } else {
//         res.render("literatureEvent", {loginUserName: "Log in"});
//     }
// });

// app.get("/lcdc", function(req, res){
//     // res.render("lcdc");
//     if(req.isAuthenticated()){
//         res.render("lcdc", {loginUserName: req.user.name});
//     } else {
//         res.render("lcdc", {loginUserName: "Log in"});
//     }
// });

// app.get("/auth/google",
//   passport.authenticate('google', { scope: ["profile", "email"] })
// );

// app.get("/auth/google/secrets",
//   passport.authenticate('google', { failureRedirect: "/login" }),
//   function(req, res) {
//     // Successful authentication, redirect to secrets.
//     res.redirect("/secrets");
// });


// app.get("/google_registration", function(req, res){
//     // res.render("google_registration");
//     User.find({"secret": {$ne: null}}, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else {
//             if(foundUser){
//                 res.render("google_registration", {userWithSecrets: foundUser, loginUserName: req.user.name});
//                 console.log(req.user.name);
//             } else {
//                 res.redirect("/login");
//             }
//         }
//     });
// });

// // app.get("/chitrakala_registration", function(req, res){
// //     res.render("chitrakala_registration");
// // });

// // app.get("/tmkoc_registration", function(req, res){
// //     res.render("tmkoc_registration");
// // })

// app.get("/login", function(req, res){
//     res.render("login");
// });


// app.get("/register", function(req, res){
//     res.render("register");
// });



// app.get("/secrets", function(req, res){
//     // if(req.isAuthenticated()){
//     //     res.render("secrets");
//     // } else {
//     //     res.redirect("/login");
//     // }
//     User.find({"secret": {$ne: null}}, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else {
//             if(foundUser){
//                 res.render("secrets", {userWithSecrets: foundUser, loginUserName: req.user.name});
//                 console.log(req.user.name);
//             }
//         }
//     });
// });

// app.get("/submit", function(req, res){
//     if(req.isAuthenticated()){
//         res.render("submit");
//     } else {
//         res.redirect("/login");
//     }
    
// });

// app.get("/tmkoc_registration", function(req, res){
//     // if(req.isAuthenticated()){
//     //     res.render("tmkoc_registration");
//     // } else {
//     //     res.redirect("/login");
//     // }
//     if(req.isAuthenticated()){
//         // const checkRegistered = Participant.findOne({tmkocusername: req.user.name});
//         // console.log(checkRegistered.getFilter());
//         // if(checkRegistered._conditions.tmkocusername === req.user.name){
//         //     res.render("tmkoc_success");
//         // } else {
//         //     res.render("tmkoc_registration");
//         // }
//         // console.log(req.participant.tmkocusername);
//         // console.log(check);
//         // if(Participant.find({"tmkocusername": req.user.name}) == checkRegistered){
//         //     console.log("Hurray");
//         //     res.render("tmkoc_success");
//         // } else {
//         //     res.render("tmkoc_registration");
//         // }
//         const participantArr = [];
//         TmkocParticipant.find(function(err, participants){
//             if(err){
//                 console.log(err);
//             } else {
                
//                 participants.forEach(function(participant){
//                     if(participant.tmkocusername == req.user.name){
//                         participantArr.push(participant.tmkocusername);
//                     }
//                 });
//                 if(participantArr.length == 0){
//                     res.render("tmkoc_registration");
//                 } else 
//                 if(participantArr.length == 1){
//                     participants.find(function(participant){
//                         if(participant.tmkocusername == req.user.name){
//                             res.render("tmkoc_success", {teamName: participant.tmkocTname});
//                         }
//                     });
                    
//                 }
//             }
//         });
//         // res.render("tmkoc_registration");
//     } else {
//         res.redirect("/login");
//     }
    
// });


// app.get("/foff_registration", function(req, res){
//     if(req.isAuthenticated()){
//         const participantArr = [];
//         FoffParticipant.find(function(err, participants){
//             if(err){
//                 console.log(err);
//             } else {
                
//                 participants.forEach(function(participant){
//                     if(participant.foffusername == req.user.name){
//                         participantArr.push(participant.foffusername);
//                     }
//                 });
//                 if(participantArr.length == 0){
//                     res.render("foff_registration");
//                 } else 
//                 if(participantArr.length == 1){
//                     participants.find(function(participant){
//                         if(participant.foffusername == req.user.name){
//                             res.render("foff_success", {teamName: participant.foffTname});
//                         }
//                     });
//                 }
//             }
//         });
//     } else {
//         res.redirect("/login");
//     }
// });


// app.get("/chitrakala_registration", function(req, res){
//     if(req.isAuthenticated()){
//         const participantArr = [];
//         ChitrakalaParticipant.find(function(err, participants){
//             if(err){
//                 console.log(err);
//             } else {
                
//                 participants.forEach(function(participant){
//                     if(participant.chitrakalausername == req.user.name){
//                         participantArr.push(participant.chitrakalausername);
//                     }
//                 });
//                 if(participantArr.length == 0){
//                     res.render("chitrakala_registration");
//                 } else 
//                 if(participantArr.length == 1){
//                     participants.find(function(participant){
//                         if(participant.chitrakalausername == req.user.name){
//                             res.render("chitrakala_success", {chitrakalausername: participant.chitrakalausername});
//                         }
//                     });
//                 }
//             }
//         });
//     } else {
//         res.redirect("/login");
//     }
// });


// // app.post("/submit", function(req, res){
// //     const submittedSecret = req.body.secret;

// //     console.log(req.user.id);

// //     User.findById(req.user.id, function(err, foundUser){
// //         if(err){
// //             console.log(err);
// //         } else {
// //             if(foundUser){
// //                 foundUser.secret = submittedSecret;
// //                 foundUser.save(function(){
// //                     res.redirect("/secrets");
// //                 });
// //             }
// //         }
// //     });
// // });

// app.get('/logout', function(req, res, next) {
//     req.logout(function(err) {
//       if (err) { return next(err); }
//       res.redirect('/');
//     });
//   });

// app.post("/register", function(req, res){
//     User.register({
//         name: req.body.name,
//         username: req.body.username,
//         userinstitutename: req.body.userinstitutename,
//         userid: req.body.userid,
//         usernumber: req.body.usernumber,
//     }, req.body.password, function(err, user){
//         if(err){
//             console.log(err);
//             res.redirect("/register");
//         } else {
//             passport.authenticate("local")(req, res, function(){
//                 res.redirect("/secrets");
//             });
//         }
//     })
// });

// app.post("/login", function(req, res){
//     const user = new User({
//         // username: req.body.username,
//         username: req.body.username,
//         // userinstitutename: req.body.userinstitutename,
//         // userid: req.body.userid,
//         // usernumber: req.body.usernumber,
//         password: req.body.password
//     });

//     req.login(user, function(err){
//         if(err){
//             console.log(err);
//         } else {
//             passport.authenticate("local")(req, res, function(){
//                 res.redirect("/secrets");
//             });
//         }
//     })
// });

// app.post("/google_registration_submit", function(req, res){

//     // const updateGoogleRegistration = new User({
//     //     userinstitutename: req.body.userinstitutename,
//     //     userid: req.body.userid,
//     //     usernumber: req.body.usernumber
//     // });
//     // console.log(updateGoogleRegistration);
//     if(isAuthenticated){
//         console.log("next print");
//     console.log(email.id);
//     res.redirect("/home");
//     User.updateOne({googleId: "email.id"}, {
//         userinstitutename: req.body.userinstitutename,
//         userid: req.body.userid,
//         usernumber: req.body.usernumber
//     }, function(err){
//         if(err){
//             console.log(err);
//         } else {
//             console.log("Successfully updated the google registraion");
//             res.redirect("/secrets");
//         }
//     });
//     }
// });

// app.post("/tmkoc_submit", function(req, res){
    
//     // const newParticpant = new Participant({

//     //     tmkocTname : req.body.tname,
//     //     tmkocP2name : req.body.p2name,
//     //     tmkocP2id : req.body.p2id
//     // });
//     console.log(req.body.tname);
    
//     console.log(req.body.p2name);
//     console.log(req.body.p2id);
//     // console.log(req.user.name);
//     if(req.isAuthenticated()){
//         TmkocParticipant.findOrCreate({
//             tmkocusername: req.user.name,
//             tmkocTname : req.body.tname,
//             tmkocP2name : req.body.p2name,
//             tmkocP2id : req.body.p2id
//         }, function(err, participant){
//             if(err){
//                 console.log(err);
//             } else {
//                 res.render("tmkoc_success", {teamName: participant.tmkocTname});
//                 console.log(participant);
//             }
//         });

        
//     } 

//     // Participant.findOrCreate({
//     //     tmkocTname : req.body.tname,
//     //     tmkocP2name : req.body.p2name,
//     //     tmkocP2id : req.body.p2id
//     // }, function (err, participant) {
//     //     if(err){
//     //         console.log(err);
//     //     } else {
//     //         res.render("tmkoc_success");
//     //         console.log(participant);
//     //     }
//     // });

//     // newParticpant.save(function(err){
//     //     if(err){
//     //         console.log(err);
//     //     } else {
//     //         res.render("tmkoc_success");
//     //     }
//     // });
    
//     //     User.findById(req.user.id, function(err, foundUser){
//     //     if(err){
//     //         console.log(err);
//     //     } else {
//     //         if(foundUser){
//     //             foundUser.tname = tmkocTname;
//     //             foundUser.save(function(){
//     //                 res.redirect("/tmkoc_registration");
//     //             });
//     //         }
//     //     }
//     // });

// });

// app.post("/foff_submit", function(req, res){
//     if(req.isAuthenticated()){
//         FoffParticipant.findOrCreate({
//             foffusername: req.user.name,
//             foffTname : req.body.tname,
//             foffP2name : req.body.p2name,
//             foffP2id : req.body.p2id
//         }, function(err, participant){
//             if(err){
//                 console.log(err);
//             } else {
//                 res.render("foff_success", {teamName: participant.foffTname});
//                 console.log(participant);
//             }
//         });
//     } 
// });


// app.post("/chitrakala_submit", function(req, res){
//     if(req.isAuthenticated()){
        

//         // upload(req, res, function (err) {
//         //     if (err instanceof multer.MulterError) {
//         //       // A Multer error occurred when uploading.
//         //       console.log(err);
//         //     } else if (err) {
//         //       // An unknown error occurred when uploading.
//         //       console.log(err);
//         //     }
        
//         //     // Everything went fine.
//         //     storage = multer.diskStorage({
//         //         destination: (req, file, cb) => {
//         //             cb(null, 'ChitrakalaEntries');
//         //         },
//         //         filename: (req, file, cb) => {
//         //             console.log(file);
//         //             cb(null, req.user.name + path.extname(file.originalname))
//         //         }
//         //     });
//         // });
        
//         // upload = multer({storage: storage});
        
//         ChitrakalaParticipant.findOrCreate({
//             chitrakalausername: req.user.name,
//             chitrakalaSubmission1: req.body.chitrakalaSubmission1,
//             tagline1: req.body.tagline1,
//             chitrakalaSubmission2: req.body.chitrakalaSubmission2,
//             tagline2: req.body.tagline2,
//             inspiration: req.body.inspiration
//         }, function(err, participant){
//             if(err){
//                 console.log(err);
//             } else {
//                 res.render("chitrakala_success", {chitrakalausername: participant.chitrakalausername});
//                 console.log(participant);
//             }
//         });
//     } 
// });



// app.listen(3000, function(){
//     console.log("Server is running on port 3000");
// });