const express = require("express");
const helmet = require("helmet");

const path = require("path");
const fs = require("fs");

const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateUser = require("./modules/validateUser");

const app = express();
const port = 8080;

app.use(helmet());

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.post("/login", function(request, response) {
    const user = JSON.parse(request.body.user);

    
});

app.post("/register", function(request, response) {
    var user = JSON.parse(request.body.user);

    
});

app.listen(port, () => {
    console.log("Started server at " + port + "!");
});