const fs = require("fs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const tk = require("./tk");

//Input validation.
exports.validateInput = function(userObj) {
    const schema = Joi.object().keys({
        email: Joi.string().email({ minDomainAtoms: 2 }),
        password: Joi.string().regex(/^.{3,}$/)
    }).with('email', 'password');
    
    const result = Joi.validate(userObj, schema);

    if(result.error === null) {
        return true;
    }
    else {
        return result.error.details[0].message;
    }
};

//Authorization.
exports.loginAsync = function(email, password) {
    return new Promise(async (resolve, reject) =>
    {
        if(email === null) { reject("'email' cannot be null!"); return; }
        if(password === null) { reject("'password' cannot be null!"); return; }

        var user = { email: email, password: password }
        var validationResult = exports.validateInput(user);

        if(validationResult === true) {
            const existingUser = await new Promise((resolveFs, rejectFs) =>
            {
                fs.readFile("./.data/users.json", function(error, data) {
                    if(error) {
                        rejectFs("loginAsync() read error: " + error.toString());
                        reject("An error occurred!");
                        return;
                    }
                    
                    const users = Array.from(JSON.parse(data.toString()));
                    const existingUser = users.find(function(usr) {
                        if(usr.email == user.email) { return true; }
                    });

                    if(existingUser === undefined) {
                        rejectFs("User doesn't exist: " + user.email);
                        reject("Invalid e-mail or password!");
                        return;
                    }

                    resolveFs(existingUser);
                });
            }).catch(function(error) { console.log(error.toString()); });

            if(existingUser === undefined || existingUser === null) { return; }

            const token = await new Promise((resolveBcrypt, rejectBcrypt) =>
            {
                bcrypt.compare(user.password, existingUser.password, function(error, result) {
                    if(error) {
                        rejectBcrypt("loginAsync() bcrypt error: " + error.toString());
                        reject("An error occurred!");
                        return;
                    }
                    else if(result === true) {
                        console.log("User logged in! (" + user.email + ")");

                        const token = jwt.sign(existingUser.email, tk.node_auth_jwt_token);
                        resolveBcrypt(JSON.stringify({ access_token: token }));
                    }
                    else {
                        rejectBcrypt("Invalid password for user '" + existingUser.email + "'");
                        reject("Invalid e-mail or password!");
                    }
                });
            }).catch(function(error) { console.log(error.toString()); });

            if(token === undefined || token === null) { return; }

            resolve(token);
        }
        else {
            reject(validationResult === null ? "An unknown error occurred!" : validationResult.toString());
        }
    });
};

//User creation.
exports.createUserAsync = function(email, password) {
    return new Promise(async (resolve, reject) =>
    {
        if(email === null) { reject("'email' cannot be null!"); return; }
        if(password === null) { reject("'password' cannot be null!"); return; }

        var user = { email: email, password: password }
        var validationResult = exports.validateInput(user);

        user.password = null;
        user.id = new Date().getTime();

        if(validationResult === true)
        {
            const salt = await new Promise((resolveSalt, rejectSalt) => {
                bcrypt.genSalt(12, function(error, resultSalt) {
                    if(error) {
                        rejectSalt("createUserAsync() salting error: " + error.toString());
                        reject("An error occurred!");
                        return;
                    }
                    resolveSalt(resultSalt);
                });
            }).catch(function(error) { console.log(error.toString()); });

            if(salt === undefined || salt === null) { return; }
            
            const hash = await new Promise((resolveHash, rejectHash) => {
                bcrypt.hash(password, salt, function(error, resultHash) {
                    if(error) {
                        rejectHash("createUserAsync() hashing error: " + error.toString());
                        reject("An error occurred!");
                        return;
                    }
                    resolveHash(resultHash);
                });
            }).catch(function(error) { console.log(error.toString()); });

            if(hash === undefined || hash === null) { return; }

            user.password = hash;
            await saveUserAsync(user)
                .then(function(result) {
                    if(result === true) {
                        console.log("User added successfully! (" + user.email + ")");
                    }
                })
                .catch(function(error) {
                    console.log(error.toString());
                    reject("An error occurred!");
                    return;
                });

            resolve(true);
        }
        else {
            reject(validationResult === null ? "An unknown error occurred!" : validationResult.toString());
        }
    });
};

//Saving users to file.
function saveUserAsync(user) {
    return new Promise(async (resolve, reject) =>
    {
        if(user === null) { reject("'user' cannot be null!"); return; }
        if(user.email === undefined || user.email === null) { reject("'user.email' cannot be null!"); return; }
        if(user.password === undefined || user.password === null) { reject("'user.password' cannot be null!"); return; }

        const users = await new Promise((resolveFs, rejectFs) => {
            fs.readFile("./.data/users.json", function(error, data) {
                if(error) {
                    rejectFs("saveUserAsync() read error: " + error.toString());
                    reject("An error occurred!");
                    return;
                }
                
                const users = Array.from(JSON.parse(data.toString()));
                users.push(user);

                resolveFs(user);
            });
        });

        if(users === undefined || users === null) { return; }

        await new Promise((resolveFs, rejectFs) => {
            fs.writeFile("./.data/users.json", JSON.stringify(users, null, 4), function(error) { 
                if(error) {
                    rejectFs("saveUserAsync() write error: " + error.toString());
                    reject("An error occurred!");
                    return;
                }

                resolveFs(true);
            });
        });

        resolve(true);
    });
}