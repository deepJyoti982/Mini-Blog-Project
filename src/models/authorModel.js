const mongoose = require('mongoose')


const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        enum: ["Mr","Mrs","Miss"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator: function(email){
                return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)
            },message:'Please fill a valid email address', isAsync:false
        }
    },
    password: {
        type: String,
        required: true,
        trim: true
    }
},{timestamps: true})

module.exports = mongoose.model('Author',authorSchema)


// { fname: { mandatory}, lname: {mandatory}, title: {mandatory, enum[Mr, Mrs, Miss]}, email: {mandatory, valid email, unique}, password: {mandatory} }