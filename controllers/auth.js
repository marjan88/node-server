const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');


function tokenForUser(user) {
    const timestamp = new Date().getTime();
    // sub (subject for whom is it refering to, user.id), iat (issued at time)
    return jwt.encode({sub: user.id, iat: timestamp}, config.secret);
}

exports.signin = function (req, res, next) {
    // user has already had their email and password auth
    // we just need to give them a token
    const user = req.user;
    res.send({token: tokenForUser(user)});
};

exports.signup = function (req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    // validation

    if (!email || !password) {
        res.status(422).send({error: "You must provide email and password!"});
    }

    User.findOne({email: email}, function (err, existingUser) {
        if (err) {
            return next(err);
        }

        if (existingUser) {
            return res.status(422).send({error: "Email is in use!"});
        }

        const user = new User({
            email: email,
            password: password
        });

        const promise = user.save();

        promise.then(function (response) {
            res.json({token: tokenForUser(response)});
        }).catch(function () {
            return next(err);
        });

    });

};

