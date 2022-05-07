const { default: mongoose } = require("mongoose")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const isValidEmail = function (email) {

    if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))) {
        return false
    }
    return true
}

const isValidPassword = function (password) {
    if(!(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/.test(password))) {
        return false
    }
    return true
}

const isValidTitle = function (title) {
    if(['Mr','Mrs','Miss'].indexOf(title) !== -1) {
        return true
    }
}



module.exports = {
    isValid,
    isValidRequestBody,
    isValidObjectId,
    isValidEmail,
    isValidPassword,
    isValidTitle
}