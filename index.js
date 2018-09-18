const express = require("express");
const helmet = require("helmet");

const path = require("path");
const fs = require("fs");

const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./modules/auth");

const app = express();
const port = 8080;

app.use(helmet());

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post("/login", function(request, response) {
    const user = JSON.parse(request.body.user);
    
    auth.loginAsync(user.email, user.password).then(function(token) {
        response.send(JSON.stringify({ access_token: token }));
    }).catch(function(error) {
        response.send(error);
    });
});

app.post("/register", function(request, response) {
    var user = JSON.parse(request.body.user);

    auth.createUserAsync(user.email, user.password).then(function(result) {
        if(result === true) {
            response.send("User created successfully!");
        }
    }).catch(function(error) {
        response.send(error);
    });
});

app.listen(port, () => {
    console.log("Started server at " + port + "!");
});