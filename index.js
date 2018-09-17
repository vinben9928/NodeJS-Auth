const express = require("express");
const helmet = require("helmet");

const path = require("path");
const fs = require("fs");

const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const auth = require("./modules/validateUser");

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
        const existingUser = users.find(function(usr) {
            if(usr.email == user.email) { return true; }
        });

        if(existingUser === undefined) {
            console.log("User doesn't exist: " + user.email);
        }
        else {
            bcrypt.compare(user.password, existingUser.password, function(error, result) {
                if(error) { console.log("Login failed: " + error.toString()); }
                if(result === true) {
                    console.log("User logged in! (" + user.email + ")");
                }
                else {
                    console.log("Invalid password!");
                }
            });
        }
    });
});

app.post("/register", function(request, response) {
    var user = JSON.parse(request.body.user);

    if(user === null) { throw "'user' cannot be null!"; }
    if(user.email === undefined || user.email === null) { throw "'user.email' cannot be null!"; }
    if(user.password === undefined || user.password === null) { throw "'user.password' cannot be null!"; }

    bcrypt.genSalt(12, function(error, salt) {
        if(error) { throw error; };

        bcrypt.hash(user.password, salt, function(error, hash) {
            if(error) { throw error; };
            response.send("Successfully registered user '" + user.email + "'!");

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