const mongoose = require("mongoose")

const loginSchema = mongoose.Schema({
    mobileNumber:{
        type: Number,
        required: true
    },
    email:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Login",loginSchema)