//user model
const mongoose = require("mongoose");

//create a user schema
const UserSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    //add username
    email : {
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    date : {
        type: Date,
        default: Date.now
    },
    avatar : {
        type: String
    },
});


module.exports = User = mongoose.model('users',UserSchema);
//module.exports = User = mongoose.model('users', UserSchema);