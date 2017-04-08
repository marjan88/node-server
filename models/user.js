const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// define our model
const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    password: String
});

// on save hook, encrypt password
userSchema.pre('save', function (next) {
    // get access to user model
    const user = this; // user.email, user.password

    // generate a salt then run callback
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        // hash our password using salt then run callback
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            // overrite plain text password with encrypted password
            user.password = hash;
            // save model
            next();
        });
    });
});
//methods inside the schema where you add custom fuctions,
// and the functions will be available through User Model

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) {
            return callback(err);
        }
        callback(null, isMatch);
    });
};

// create model class
const UserModel = mongoose.model('user', userSchema);

// export the model
module.exports = UserModel;