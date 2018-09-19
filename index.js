const express = require("express");
const helmet = require("helmet");

const path = require("path");
const fs = require("fs");
const log = require("./middleware/log");

const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("./modules/auth");

const app = express();
const port = 8080;

app.use(helmet());
app.use(log);

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post("/login", function(request, response) {
    if(request.body.email === undefined || request.body.email === null) { response.send("Bad request!"); return; }
    if(request.body.password === undefined || request.body.password === null) { response.send("Bad request!"); return; }

    const user = { email: request.body.email, password: request.body.password };

    auth.loginAsync(user.email, user.password)
        .then(function(token) {
            if(token !== undefined && token.access_token !== undefined
                && token !== null && token.access_token !== null) {
                response.send(JSON.stringify(token));
            }
            else {
                console.log("Token null!");
                response.send(JSON.stringify({error: "An error occurred!"}));
            }
        })
        .catch(function(error) {
            response.send(JSON.stringify({error: error}));
        });
});

app.post("/register", function(request, response) {
    if(request.body.email === undefined || request.body.email === null) { response.send("Bad request!"); return; }
    if(request.body.password === undefined || request.body.password === null) { response.send("Bad request!"); return; }
    
    const user = { email: request.body.email, password: request.body.password };

    auth.createUserAsync(user.email, user.password)
        .then(function(result) {
            if(result === true) {
                response.send(JSON.stringify({success: true}));
            }
        })
        .catch(function(error) {
            response.send(JSON.stringify({error: error}));
        });
});

app.listen(port, () => {
    console.log("Started server at " + port + "!");
});