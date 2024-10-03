const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        unique: true // Ensure username is unique
    }, // Use username as _id
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.plugin(passportLocalMongoose, { usernameField: '_id' });

module.exports = mongoose.model('User', UserSchema);