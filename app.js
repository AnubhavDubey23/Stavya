//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const session = require('express-session');
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');

const multer = require('multer');

const fs = require("fs");
const { google } = require("googleapis");


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Entries')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + req.user.name + file.originalname.match(/\..*$/)[0])
    }
});

const chitrakala_upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).fields([
    { name: 'chitrakalaSubmission1', maxCount: 1 },
    { name: 'chitrakalaSubmission2', maxCount: 1 }
  ])

//Pixellence Photography
const pixellence_upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .png, .jpg and .jpeg format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).fields([
    { name: 'pixellenceSubmission1', maxCount: 1 },
    { name: 'pixellenceSubmission2', maxCount: 1 }
  ]);

const poetry_upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf" ) {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .pdf format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).fields([
    { name: 'poetrySubmission', maxCount: 1 }
]);

const telegram_upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "application/pdf" ) {
            cb(null, true);
        } else {
            cb(null, false);
            const err = new Error('Only .pdf format allowed!')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).fields([
    { name: 'telegramSubmission', maxCount: 1 }
]);


async function uploaFilePdf(uploadedName, touploadName, driveId){
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "./googlekey.json",
            scopes: ["https://www.googleapis.com/auth/drive"]
        })

        const driveService = google.drive({
            version: 'v3', 
            auth
        })

        const fileMetaData = {
            'name' : uploadedName,
            'parents' : [driveId]
        }

        const media = {
            MimeType: 'application/pdf',
            body: fs.createReadStream(touploadName)
        }

        const express = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        })
        return express.data.id ;

    } catch (err) {
        console.log('upload file error', err);
    }
};


async function uploaFileSingle(uploadedName, touploadName, driveId){
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "./googlekey.json",
            scopes: ["https://www.googleapis.com/auth/drive"]
        })

        const driveService = google.drive({
            version: 'v3', 
            auth
        })

        const fileMetaData = {
            'name' : uploadedName,
            'parents' : [driveId]
        }

        const media = {
            MimeType: 'image/jpg',
            body: fs.createReadStream(touploadName)
        }

        const express = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            fields: 'id'
        })
        return express.data.id ;

    } catch (err) {
        console.log('upload file error', err);
    }
}


async function uploaFileDouble(uploadedName1, touploadName1, uploadedName2, touploadName2, driveId){
    try {
        const auth = new google.auth.GoogleAuth({
            keyFile: "./googlekey.json",
            scopes: ["https://www.googleapis.com/auth/drive"]
        })

        const driveService = google.drive({
            version: 'v3', 
            auth
        })

        const fileMetaData1 = {
            'name' : uploadedName1,
            'parents' : [driveId]
        }

        const fileMetaData2 = {
            'name' : uploadedName2,
            'parents' : [driveId]
        }

        const media1 = {
            MimeType: 'image/jpg',
            body: fs.createReadStream(touploadName1)
        }

        const media2 = {
            MimeType: 'image/jpg',
            body: fs.createReadStream(touploadName2)
        }

        const express1 = await driveService.files.create({
            resource: fileMetaData1,
            media: media1,
            fields: 'id'
        })

        const express2 = await driveService.files.create({
            resource: fileMetaData2,
            media: media2,
            fields: 'id'
        })
        return express1.data.id + '~'+ express2.data.id;

    } catch (err) {
        console.log('upload file error', err);
    }
}


mongoose.set('strictQuery', true);

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: "A little secret for website stavya.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB",{
    useNewUrlParser: true
});


const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    userinstitutename: String,
    userid: Number,
    usernumber: Number,
    password: String,
    googleId: String,
    secret: String
});

const tmkocSchema = new mongoose.Schema({
    tmkocusername: String,
    tmkocTname: String,
    tmkocP2name: String,
    tmkocP2id: Number
});

const foffSchema = new mongoose.Schema({
    foffusername: String,
    foffTname: String,
    foffP2name: String,
    foffP2id: Number
});

const chitrakalaSchema = new mongoose.Schema({
    chitrakalausername: String,
    chitrakalaSubmission1: String,
    tagline1: String,
    chitrakalaSubmission2: String,
    tagline2: String,
    inspiration: String
});

const pixellenceSchema = new mongoose.Schema({
    pixellenceusername: String,
    pixellenceSubmission1: String,
    tagline1: String,
    pixellenceSubmission2: String,
    tagline2: String,
    technicalDetails: String,
    deviceUsed: String
});

const nrityakalaSchema = new mongoose.Schema({
    nrityakalausername: String,
    nrityakalaLeader: String,
    nrityakalaLeaderId: Number,
    nrityakalaP2: String,
    nrityakalaP2Id: Number,
    nrityakalaP3: String,
    nrityakalaP3Id: Number,
    nrityakalaTeamName: String,
    nrityakalaWhatsappNo: Number,
    nrityakalaInstituteName: String,
    nrityakalaLeaderEmailId: String
});

const debateSchema = new mongoose.Schema({
    debateusername: String,
    debateTname: String,
    debateP2name: String,
    debateP2id: Number
});

const shaswatSchema = new mongoose.Schema({
    shaswatusername: String,
    shaswatTname: String,
    shaswatP2name: String,
    shaswatP2id: Number
});

const poetrySchema = new mongoose.Schema({
    poetryusername: String,
    poetrySubmission: String,
    poetryTagline: String,
    poetryInspiration: String
});

const telegramSchema = new mongoose.Schema({
    telegramusername: String,
    telegramSubmission: String,
    telegramTagline: String,
    telegramInspiration: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

tmkocSchema.plugin(findOrCreate);
foffSchema.plugin(findOrCreate);
chitrakalaSchema.plugin(findOrCreate);
pixellenceSchema.plugin(findOrCreate);
nrityakalaSchema.plugin(findOrCreate);

debateSchema.plugin(findOrCreate);
shaswatSchema.plugin(findOrCreate);
poetrySchema.plugin(findOrCreate);
telegramSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);
const TmkocParticipant = new mongoose.model("TmkocParticipant", tmkocSchema);
const FoffParticipant = new mongoose.model("FoffParticipant", foffSchema);
const ChitrakalaParticipant = new mongoose.model("ChitrakalaParticipant", chitrakalaSchema);
const PixellenceParticipant = new mongoose.model("PixellenceParticipant", pixellenceSchema);
const NrityakalaParticipant = new mongoose.model("NrityakalaParticipant", nrityakalaSchema);
const DebateParticipant = new mongoose.model("DebateParticipant", debateSchema);
const ShaswatParticipant = new mongoose.model("ShaswatParticipant", shaswatSchema);
const PoetryParticipant = new mongoose.model("PoetryParticipant", poetrySchema);
const TelegramParticipant = new mongoose.model("TelegramParticipant", telegramSchema);

passport.use(User.createStrategy());


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, email, cb) {
    
    const emailStr = JSON.stringify(email.emails);
    const emailSubString = emailStr.substring(
        emailStr.indexOf(":") + 2, 
        emailStr.lastIndexOf(",") - 1
    );
    console.log(emailSubString);

    User.findOrCreate({ googleId: email.id, name: email.displayName, username: emailSubString}, function (err, user) {
      return cb(err, user);
    });
  }
));




app.get("/", function(req, res){
    if(req.isAuthenticated()){
        res.render("home", {loginUserName: req.user.name});
    } else {
        res.render("home", {loginUserName: "Log in"});
    }
});



app.get("/home", function(req, res){
    // res.render("home");
    if(req.isAuthenticated()){
        res.render("home", {loginUserName: req.user.name});
    } else {
        res.render("home", {loginUserName: "Log in"});
    }
});


app.get("/tmkoc_home", function(req, res){
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    res.render("tmkoc_home", {loginUserName: req.user.name});
                    console.log(req.user.name);
                } else {
                    res.redirect("/login");
                }
            }
        });
    } else {
        res.render("tmkoc_home", {loginUserName: "Log in"});
    }
    
});

app.get("/chitrakala_home", function(req, res){
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    res.render("chitrakala_home", {loginUserName: req.user.name});
                    console.log(req.user.name);
                } else {
                    res.redirect("/login");
                }
            }
        });
    } else {
        res.render("chitrakala_home", {loginUserName: "Log in"});
    }
    
});

app.get("/pixellence_home", function(req, res){
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    res.render("pixellence_home", {loginUserName: req.user.name});
                    console.log(req.user.name);
                } else {
                    res.redirect("/login");
                }
            }
        });
    } else {
        res.render("pixellence_home", {loginUserName: "Log in"});
    }
    
});

app.get("/nrityakala_home", function(req, res){
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    res.render("nrityakala_home", {loginUserName: req.user.name});
                    console.log(req.user.name);
                } else {
                    res.redirect("/login");
                }
            }
        });
    } else {
        res.render("nrityakala_home", {loginUserName: "Log in"});
    }
});



app.get("/foff_home", function(req, res){
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    res.render("foff_home", {loginUserName: req.user.name});
                    console.log(req.user.name);
                } else {
                    res.redirect("/login");
                }
            }
        });
    } else {
        res.render("foff_home", {loginUserName: "Log in"});
    }
});

app.get("/debate_home", function(req, res){
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    res.render("debate_home", {loginUserName: req.user.name});
                    console.log(req.user.name);
                } else {
                    res.redirect("/login");
                }
            }
        });
    } else {
        res.render("debate_home", {loginUserName: "Log in"});
    }
});

app.get("/shaswat_home", function(req, res){
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    res.render("shaswat_home", {loginUserName: req.user.name});
                    console.log(req.user.name);
                } else {
                    res.redirect("/login");
                }
            }
        });
    } else {
        res.render("shaswat_home", {loginUserName: "Log in"});
    }
});

app.get("/poetry_home", function(req, res){
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    res.render("poetry_home", {loginUserName: req.user.name});
                    console.log(req.user.name);
                } else {
                    res.redirect("/login");
                }
            }
        });
    } else {
        res.render("poetry_home", {loginUserName: "Log in"});
    }
});

app.get("/telegram_home", function(req, res){
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    res.render("telegram_home", {loginUserName: req.user.name});
                    console.log(req.user.name);
                } else {
                    res.redirect("/login");
                }
            }
        });
    } else {
        res.render("telegram_home", {loginUserName: "Log in"});
    }
});

app.get("/om_home", function(req, res){
    if(req.isAuthenticated()){
        User.find({"secret": {$ne: null}}, function(err, foundUser){
            if(err){
                console.log(err);
            } else {
                if(foundUser){
                    res.render("om_home", {loginUserName: req.user.name});
                    console.log(req.user.name);
                } else {
                    res.redirect("/login");
                }
            }
        });
    } else {
        res.render("om_home", {loginUserName: "Log in"});
    }
});



app.get("/culturalEvent", function(req, res){
    // res.render("culturalEvent");
    if(req.isAuthenticated()){
        res.render("culturalEvent", {loginUserName: req.user.name});
    } else {
        res.render("culturalEvent", {loginUserName: "Log in"});
    }
});

app.get("/literatureEvent", function(req, res){
    // res.render("literatureEvent");
    if(req.isAuthenticated()){
        res.render("literatureEvent", {loginUserName: req.user.name});
    } else {
        res.render("literatureEvent", {loginUserName: "Log in"});
    }
});

app.get("/lcdc", function(req, res){
    // res.render("lcdc");
    if(req.isAuthenticated()){
        res.render("lcdc", {loginUserName: req.user.name});
    } else {
        res.render("lcdc", {loginUserName: "Log in"});
    }
});

app.get("/auth/google",
  passport.authenticate('google', { scope: ["profile", "email"] })
);

app.get("/auth/google/secrets",
  passport.authenticate('google', { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect to secrets.
    res.redirect("/secrets");
});


app.get("/google_registration", function(req, res){
    // res.render("google_registration");
    User.find({"secret": {$ne: null}}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                res.render("google_registration", {userWithSecrets: foundUser, loginUserName: req.user.name});
                console.log(req.user.name);
            } else {
                res.redirect("/login");
            }
        }
    });
});

// app.get("/chitrakala_registration", function(req, res){
//     res.render("chitrakala_registration");
// });

// app.get("/tmkoc_registration", function(req, res){
//     res.render("tmkoc_registration");
// })

app.get("/login", function(req, res){
    res.render("login");
});


app.get("/register", function(req, res){
    res.render("register");
});



app.get("/secrets", function(req, res){
    // if(req.isAuthenticated()){
    //     res.render("secrets");
    // } else {
    //     res.redirect("/login");
    // }
    User.find({"secret": {$ne: null}}, function(err, foundUser){
        if(err){
            console.log(err);
        } else {
            if(foundUser){
                res.render("secrets", {userWithSecrets: foundUser, loginUserName: req.user.name});
                console.log(req.user.name);
            }
        }
    });
});

app.get("/submit", function(req, res){
    if(req.isAuthenticated()){
        res.render("submit");
    } else {
        res.redirect("/login");
    }
    
});

app.get("/nrityakala_registration", function(req, res){
    if(req.isAuthenticated()){
        const participantArr = [];
        NrityakalaParticipant.find(function(err, participants){
            if(err){
                console.log(err);
            } else {
                
                participants.forEach(function(participant){
                    if(participant.nrityakalausername == req.user.name){
                        participantArr.push(participant.nrityakalausername);
                    }
                });
                if(participantArr.length == 0){
                    res.render("nrityakala_registration");
                } else 
                if(participantArr.length == 1){
                    participants.find(function(participant){
                        if(participant.nrityakalausername == req.user.name){
                            res.render("nrityakala_success", {teamName: participant.nrityakalaTeamName});
                        }
                    });
                }
            }
        });
    } else {
        res.redirect("/login");
    }
})

app.get("/tmkoc_registration", function(req, res){
    if(req.isAuthenticated()){
        const participantArr = [];
        TmkocParticipant.find(function(err, participants){
            if(err){
                console.log(err);
            } else {
                
                participants.forEach(function(participant){
                    if(participant.tmkocusername == req.user.name){
                        participantArr.push(participant.tmkocusername);
                    }
                });
                if(participantArr.length == 0){
                    res.render("tmkoc_registration");
                } else 
                if(participantArr.length == 1){
                    participants.find(function(participant){
                        if(participant.tmkocusername == req.user.name){
                            res.render("tmkoc_success", {teamName: participant.tmkocTname});
                        }
                    });
                    
                }
            }
        });
        // res.render("tmkoc_registration");
    } else {
        res.redirect("/login");
    }
    
});


app.get("/foff_registration", function(req, res){
    if(req.isAuthenticated()){
        const participantArr = [];
        FoffParticipant.find(function(err, participants){
            if(err){
                console.log(err);
            } else {
                
                participants.forEach(function(participant){
                    if(participant.foffusername == req.user.name){
                        participantArr.push(participant.foffusername);
                    }
                });
                if(participantArr.length == 0){
                    res.render("foff_registration");
                } else 
                if(participantArr.length == 1){
                    participants.find(function(participant){
                        if(participant.foffusername == req.user.name){
                            res.render("foff_success", {teamName: participant.foffTname});
                        }
                    });
                }
            }
        });
    } else {
        res.redirect("/login");
    }
});


app.get("/chitrakala_registration", function(req, res){
    if(req.isAuthenticated()){
        const participantArr = [];
        ChitrakalaParticipant.find(function(err, participants){
            if(err){
                console.log(err);
            } else {
                
                participants.forEach(function(participant){
                    if(participant.chitrakalausername == req.user.name){
                        participantArr.push(participant.chitrakalausername);
                    }
                });
                if(participantArr.length == 0){
                    res.render("chitrakala_registration");
                } else 
                if(participantArr.length == 1){
                    participants.find(function(participant){
                        if(participant.chitrakalausername == req.user.name){
                            res.render("chitrakala_success", {chitrakalausername: participant.chitrakalausername});
                        }
                    });
                }
            }
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/pixellence_registration", function(req, res){
    if(req.isAuthenticated()){
        // res.render("pixellence_registration");
        const participantArr = [];
        PixellenceParticipant.find(function(err, participants){
            if(err){
                console.log(err);
            } else {
                
                participants.forEach(function(participant){
                    if(participant.pixellenceusername == req.user.name){
                        participantArr.push(participant.pixellenceusername);
                    }
                });
                if(participantArr.length == 0){
                    res.render("pixellence_registration");
                } else 
                if(participantArr.length == 1){
                    participants.find(function(participant){
                        if(participant.pixellenceusername == req.user.name){
                            res.render("pixellence_success", {pixellenceusername: participant.pixellenceusername});
                        }
                    });
                }
            }
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/debate_registration", function(req, res){
    if(req.isAuthenticated()){
        const participantArr = [];
        DebateParticipant.find(function(err, participants){
            if(err){
                console.log(err);
            } else {
                
                participants.forEach(function(participant){
                    if(participant.debateusername == req.user.name){
                        participantArr.push(participant.debateusername);
                    }
                });
                if(participantArr.length == 0){
                    res.render("debate_registration");
                } else 
                if(participantArr.length == 1){
                    participants.find(function(participant){
                        if(participant.debateusername == req.user.name){
                            res.render("debate_success", {teamName: participant.debateTname});
                        }
                    });
                }
            }
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/shaswat_registration", function(req, res){
    if(req.isAuthenticated()){
        const participantArr = [];
        ShaswatParticipant.find(function(err, participants){
            if(err){
                console.log(err);
            } else {
                
                participants.forEach(function(participant){
                    if(participant.shaswatusername == req.user.name){
                        participantArr.push(participant.shaswatusername);
                    }
                });
                if(participantArr.length == 0){
                    res.render("shaswat_registration");
                } else 
                if(participantArr.length == 1){
                    participants.find(function(participant){
                        if(participant.shaswatusername == req.user.name){
                            res.render("shaswat_success", {teamName: participant.shaswatTname});
                        }
                    });
                }
            }
        });
    } else {
        res.redirect("/login");
    }
});

// app.get("/poetry_registration", function(req, res){
//     res.render("poetry_registration");
// })

app.get("/poetry_registration", function(req, res){
    if(req.isAuthenticated()){
        // res.render("pixellence_registration");
        const participantArr = [];
        PoetryParticipant.find(function(err, participants){
            if(err){
                console.log(err);
            } else {
                
                participants.forEach(function(participant){
                    if(participant.poetryusername == req.user.name){
                        participantArr.push(participant.poetryusername);
                    }
                });
                if(participantArr.length == 0){
                    res.render("poetry_registration");
                } else 
                if(participantArr.length == 1){
                    participants.find(function(participant){
                        if(participant.poetryusername == req.user.name){
                            res.render("poetry_success", {poetryusername: participant.poetryusername});
                        }
                    });
                }
            }
        });
    } else {
        res.redirect("/login");
    }
});

app.get("/telegram_registration", function(req, res){
    if(req.isAuthenticated()){
        // res.render("pixellence_registration");
        const participantArr = [];
        PoetryParticipant.find(function(err, participants){
            if(err){
                console.log(err);
            } else {
                
                participants.forEach(function(participant){
                    if(participant.telegramusername == req.user.name){
                        participantArr.push(participant.telegramusername);
                    }
                });
                if(participantArr.length == 0){
                    res.render("telegram_registration");
                } else 
                if(participantArr.length == 1){
                    participants.find(function(participant){
                        if(participant.telegramusername == req.user.name){
                            res.render("telegram_success", {telegramusername: participant.telegramusername});
                        }
                    });
                }
            }
        });
    } else {
        res.redirect("/login");
    }
});


// app.post("/submit", function(req, res){
//     const submittedSecret = req.body.secret;

//     console.log(req.user.id);

//     User.findById(req.user.id, function(err, foundUser){
//         if(err){
//             console.log(err);
//         } else {
//             if(foundUser){
//                 foundUser.secret = submittedSecret;
//                 foundUser.save(function(){
//                     res.redirect("/secrets");
//                 });
//             }
//         }
//     });
// });

app.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

app.post("/register", function(req, res){
    User.register({
        name: req.body.name,
        username: req.body.username,
        userinstitutename: req.body.userinstitutename,
        userid: req.body.userid,
        usernumber: req.body.usernumber,
    }, req.body.password, function(err, user){
        if(err){
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    })
});

app.post("/login", function(req, res){
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err){
            console.log(err);
        } else {
            passport.authenticate("local")(req, res, function(){
                res.redirect("/secrets");
            });
        }
    })
});

app.post("/google_registration_submit", function(req, res){

    // const updateGoogleRegistration = new User({
    //     userinstitutename: req.body.userinstitutename,
    //     userid: req.body.userid,
    //     usernumber: req.body.usernumber
    // });
    // console.log(updateGoogleRegistration);
    if(isAuthenticated){
        console.log("next print");
    console.log(email.id);
    res.redirect("/home");
    User.updateOne({googleId: "email.id"}, {
        userinstitutename: req.body.userinstitutename,
        userid: req.body.userid,
        usernumber: req.body.usernumber
    }, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("Successfully updated the google registraion");
            res.redirect("/secrets");
        }
    });
    }
});

app.post("/tmkoc_submit", function(req, res){
    
    // console.log(req.body.tname);
    
    // console.log(req.body.p2name);
    // console.log(req.body.p2id);
    // console.log(req.user.name);
    if(req.isAuthenticated()){
        TmkocParticipant.findOrCreate({
            tmkocusername: req.user.name,
            tmkocTname : req.body.tname,
            tmkocP2name : req.body.p2name,
            tmkocP2id : req.body.p2id
        }, function(err, participant){
            if(err){
                console.log(err);
            } else {
                res.render("tmkoc_success", {teamName: participant.tmkocTname});
                console.log(participant);
            }
        });
    }  else {
        res.redirect("/login");
    }
});

app.post("/foff_submit", function(req, res){
    if(req.isAuthenticated()){
        FoffParticipant.findOrCreate({
            foffusername: req.user.name,
            foffTname : req.body.tname,
            foffP2name : req.body.p2name,
            foffP2id : req.body.p2id
        }, function(err, participant){
            if(err){
                console.log(err);
            } else {
                res.render("foff_success", {teamName: participant.foffTname});
                console.log(participant);
            }
        });
    }  else {
        res.redirect("/login");
    }
});

app.post("/nrityakala_submit", function(req, res){
    if(req.isAuthenticated()){
        NrityakalaParticipant.findOrCreate({
            nrityakalausername: req.user.name,
            nrityakalaLeader: req.body.leader,
            nrityakalaLeaderId: req.body.leaderId,
            nrityakalaP2: req.body.p2name,
            nrityakalaP2Id: req.body.p2id,
            nrityakalaP3: req.body.p3name,
            nrityakalaP3Id: req.body.p3id,
            nrityakalaTeamName: req.body.tName,
            nrityakalaWhatsappNo: req.body.whatsappNo,
            nrityakalaInstituteName: req.body.instituteName,
            nrityakalaLeaderEmailId: req.body.leaderEmailId
        }, function(err, participant){
            if(err){
                console.log(err);
            } else {
                res.render("nrityakala_success", {teamName: participant.nrityakalaTeamName});
                console.log(participant);
            }
        });
    }  else {
        res.redirect("/login");
    }
});


app.post("/chitrakala_submit", function(req, res){
    if(req.isAuthenticated()){
        chitrakala_upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
                return;
            } else if (err) {
                // An unknown error occurred when uploading.
                if (err.name == 'ExtensionError') {
                    res.status(413).send({ error: { message: err.message } }).end();
                } else {
                    res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
                }
                return;
            }
            if(req.files.chitrakalaSubmission2 == undefined){
                uploaFileSingle(req.user.name+" - Chitrakala Submission 1", req.files.chitrakalaSubmission1[0].path, process.env.CHITRAKALA_DRIVE_ID).then(data =>{
                    console.log(data);
                    const newUser = new ChitrakalaParticipant({
                        chitrakalausername: req.user.name,
                        chitrakalaSubmission1: data.split('~')[0],
                        tagline1: req.body.tagline1,
                        inspiration: req.body.inspiration
                    });
                    newUser.save(function(err, participant){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("chitrakala_success", {chitrakalausername: req.user.name, uniqueid: convertToHex("CHI-"+req.user.name)%1000});
                            console.log(participant);
                        }
                    });
                });
            } else {
                uploaFileDouble(req.user.name+" - Chitrakala Submission 1", req.files.chitrakalaSubmission1[0].path, req.user.name+" - Chitrakala Submission 2", req.files.chitrakalaSubmission2[0].path, process.env.CHITRAKALA_DRIVE_ID).then(data =>{
                    console.log(data);
                    const newUser = new ChitrakalaParticipant({
                        chitrakalausername: req.user.name,
                        chitrakalaSubmission1: data.split('~')[0],
                        tagline1: req.body.tagline1,
                        chitrakalaSubmission2: data.split('~')[1],
                        tagline2: req.body.tagline2,
                        inspiration: req.body.inspiration
                    });
                    newUser.save(function(err, participant){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("chitrakala_success", {chitrakalausername: req.user.name, uniqueid: convertToHex("CHI-"+req.user.name)%1000});
                            console.log(participant);
                        }
                    });
                });
            }

            // console.log(req.files.chitrakalaSubmission1[0].filename);
            // res.render("chitrakala_success", {chitrakalausername: req.user.name, uniqueid: convertToHex("CHI-"+req.user.name)%1000});
        })
    } else {
        res.redirect("/login");
    }
});

function convertToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}

app.post("/pixellence_submit", function(req, res){
    if(req.isAuthenticated()){
        pixellence_upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
                return;
            } else if (err) {
                // An unknown error occurred when uploading.
                if (err.name == 'ExtensionError') {
                    res.status(413).send({ error: { message: err.message } }).end();
                } else {
                    res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
                }
                return;
            }

            if(req.files.pixellenceSubmission2 == undefined){
                uploaFileSingle(req.user.name+" - Pixellence Submission 1", req.files.pixellenceSubmission1[0].path, process.env.PIXELLENCE_DRIVE_ID).then(data =>{
                    console.log(data);
                    const newUser = new PixellenceParticipant({
                        pixellenceusername: req.user.name,
                        pixellenceSubmission1: data,
                        tagline1: req.body.tagline1,
                        technicalDetails: req.body.technicalDetails,
                        deviceUsed: req.body.deviceUsed
                    });
                    newUser.save(function(err, participant){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("pixellence_success", {pixellenceusername: req.user.name, uniqueid: "PIX-01" + convertToHex(req.user.name)%1000 });
                            console.log(participant);
                        }
                    });
                });
            } else {
                uploaFileDouble(req.user.name+" - Pixellence Submission 1", req.files.pixellenceSubmission1[0].path,req.user.name+" - Pixellence Submission 2", req.files.pixellenceSubmission2[0].path, process.env.PIXELLENCE_DRIVE_ID).then(data =>{
                    console.log(data);
                    const newUser = new PixellenceParticipant({
                        pixellenceusername: req.user.name,
                        pixellenceSubmission1: data.split('~')[0],
                        tagline1: req.body.tagline1,
                        pixellenceSubmission2: data.split('~')[1],
                        tagline2: req.body.tagline2,
                        technicalDetails: req.body.technicalDetails,
                        deviceUsed: req.body.deviceUsed
                    });
                    newUser.save(function(err, participant){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("pixellence_success", {pixellenceusername: req.user.name, uniqueid: convertToHex("PIX-"+req.user.name)%1000});
                            console.log(participant);
                        }
                    });
                });
            }
            // console.log(req.newUser);
            res.render("pixellence_success", {pixellenceusername: req.user.name});
        })
    } else {
        res.redirect("/login");
    }
});


app.post("/debate_submit", function(req, res){
    if(req.isAuthenticated()){
        DebateParticipant.findOrCreate({
            debateusername: req.user.name,
            debateTname : req.body.tname,
            debateP2name : req.body.p2name,
            debateP2id : req.body.p2id
        }, function(err, participant){
            if(err){
                console.log(err);
            } else {
                res.render("debate_success", {teamName: participant.debateTname});
                console.log(participant);
            }
        });
    }  else {
        res.redirect("/login");
    }
});

app.post("/shaswat_submit", function(req, res){
    if(req.isAuthenticated()){
        ShaswatParticipant.findOrCreate({
            shaswatusername: req.user.name,
            shaswatTname : req.body.tname,
            shaswatP2name : req.body.p2name,
            shaswatP2id : req.body.p2id
        }, function(err, participant){
            if(err){
                console.log(err);
            } else {
                res.render("shaswat_success", {teamName: participant.shaswatTname});
                console.log(participant);
            }
        });
    }  else {
        res.redirect("/login");
    }
});

app.post("/poetry_submit", function(req, res){
    if(req.isAuthenticated()){
        poetry_upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
                return;
            } else if (err) {
                // An unknown error occurred when uploading.
                if (err.name == 'ExtensionError') {
                    res.status(413).send({ error: { message: err.message } }).end();
                } else {
                    res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
                }
                return;
            }

            uploaFilePdf(req.user.name+" - Poetry Submission", req.files.poetrySubmission[0].path, process.env.POETRY_DRIVE_ID).then(data =>{
                console.log(data);
                const newUser = new PoetryParticipant({
                    poetryusername: req.user.name,
                    poetrySubmission: data,
                    poetryTagline: req.body.tagline,
                    poetryInspiration: req.body.inspiration
                });
                newUser.save(function(err, participant){
                    if(err){
                        console.log(err);
                    } else {
                        res.render("poetry_success", {poetryusername: req.user.name});
                        console.log(participant);
                    }
                });
            });
            // console.log(req.newUser);
            // res.render("pixellence_success", {pixellenceusername: req.user.name});
        })
    } else {
        res.redirect("/login");
    }
});


app.post("/telegram_submit", function(req, res){
    if(req.isAuthenticated()){
        telegram_upload(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                res.status(500).send({ error: { message: `Multer uploading error: ${err.message}` } }).end();
                return;
            } else if (err) {
                // An unknown error occurred when uploading.
                if (err.name == 'ExtensionError') {
                    res.status(413).send({ error: { message: err.message } }).end();
                } else {
                    res.status(500).send({ error: { message: `unknown uploading error: ${err.message}` } }).end();
                }
                return;
            }

            uploaFilePdf(req.user.name+" - Telegram Submission", req.files.telegramSubmission[0].path, process.env.TELEGRAM_DRIVE_ID).then(data =>{
                console.log(data);
                const newUser = new TelegramParticipant({
                    telegramusername: req.user.name,
                    telegramSubmission: data,
                    telegramTagline: req.body.tagline,
                    telegramInspiration: req.body.inspiration
                });
                newUser.save(function(err, participant){
                    if(err){
                        console.log(err);
                    } else {
                        res.render("telegram_success", {telegramusername: req.user.name});
                        console.log(participant);
                    }
                });
            });
            // console.log(req.newUser);
            // res.render("pixellence_success", {pixellenceusername: req.user.name});
        })
    } else {
        res.redirect("/login");
    }
});



app.listen(3000, function(){
    console.log("Server is running on port 3000");
});
