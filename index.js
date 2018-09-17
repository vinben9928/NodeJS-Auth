const express = require("express");
const helmet = require("helmet");

const path = require("path");
const fs = require("fs");

const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const auth = require("./modules/auth");

const app = express();
const port = 8080;

app.use(helmet());

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post("/login", function(request, response) {
    const user = JSON.parse(request.body.user);

    fs.readFile("./.data/users.json", function(error, data) {
        if(error) { throw error; }
        
        const users = Array.from(JSON.parse(data.toString()));
        const userExists = users.find(function(usr) {
            if(usr.email == user.email) { return true; }
        });

        if(userExists === undefined) {
            console.log("Login attempt failed: " + user.email);
        }
        else {

        }
    });
});

app.post("/register", function(request, response) {
    var user = {};
    user.email = "john@example.com";

    var tempPassword = "abcd123";
    
    bcrypt.genSalt(12, function(error, salt) {
        if(error) { throw error; };

        bcrypt.hash(tempPassword, salt, function(error, hash) {
            if(error) { throw error; };
            
            res.send("");

            user.password = hash;
            saveUser(user);
        });
    });
});

app.listen(port, () => {
    console.log("Started server at " + port + "!");
});



//Helper functions.
function saveUser(user) {
    if(user === null) { throw "'user' cannot be null!"; }
    if(user.email === undefined || user.email === null) { throw "'user.email' cannot be null!"; }
    if(user.password === undefined || user.password === null) { throw "'user.password' cannot be null!"; }

    fs.readFile("./.data/users.json", function(error, data) {
        if(error) { throw error; }
        
        const users = Array.from(JSON.parse(data.toString()));
        users.push(user);

        fs.writeFile("./.data/users.json", JSON.stringify(users, null, 4), function(err) { 
            if(err) { console.log("Failed to add user: " + err.toString()); }
            else    { console.log("User added successfully! (" + user.email + ")"); }
        });
    });
}