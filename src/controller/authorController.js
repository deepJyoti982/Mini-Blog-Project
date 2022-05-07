const authorModel = require('../models/authorModel')
const validator = require('../validations/validator')
const jwt = require("jsonwebtoken")

const createAuthor = async function(req,res) {
    try {
        const authorData = req.body
        if(!validator.isValidRequestBody(authorData)) {
            return res.status( 400 ).send({status: false, msg: "Invalid request parameters! Please provide author details"})
        }

        const { fname,lname,title,email,password } = authorData;
        
        if(!validator.isValid(fname)) {
            return res.status( 400 ).send({status: false, msg: "Author fname is required"})
        }
        if(!validator.isValid(lname)) {
            return res.status( 400 ).send({status: false, msg: "Author lname is required"})
        }

        if(validator.isValid(title)) {
            if(!validator.isValidTitle(title)) {
                return res.status( 400 ).send({status: false, msg: "Title should be Mr , Mrs or Miss"})
            }
        }else {
            return res.status( 400 ).send({status: false, msg: "Author title is required"})
        }

        if(validator.isValid(email)) {
            if(!validator.isValidEmail(email)) {
                return res.status(400).send({status:false, message: "Emial should be a valid email address"})
            }
        }else {

            return res.status( 400 ).send({status: false, msg: "Author email Id is required"})
        }

        if(await authorModel.findOne({email: email})) {
            return res.status( 400 ).send({status: false, msg: "This email Id is already in use!"})
        }

        if(validator.isValid(password)) {
            if(!validator.isValidPassword(password)) {
                return res.status(400).send({status:false, message: "Password is not valid"})
            }
        }else {
            return res.status( 400 ).send({status: false, msg: "Password is required"})
        }

        
        const saveAuthor = await authorModel.create(authorData)
        res.status( 201 ).send({status: true, msg: "Author created successfully", data: saveAuthor})
    }
    catch(error) {
        res.status( 500 ).send({msg: error.message})
    }
}

const authorLogin = async function (req, res) {

    try {
        const loginData = req.body
        if(!validator.isValidRequestBody(loginData)) {
            return res.status( 400 ).send({status: false, msg: "Invalid request parameters! Please provide email Id and password"})
        }

        const {email,password} = loginData;


        if(!validator.isValid(email)) return res.status( 400 ).send({status: false, msg: "Please enter your email"})
        if(!validator.isValid(password)) return res.status( 400 ).send({status: false, msg: "Please enter your password"})

        let author = await authorModel.findOne({ email: email, password: password })
        if (!author) {
            return res.status( 400 ).send({ status: false, msg: "username or the password is not correct" })
        }
        let token = jwt.sign(
            {
                userId: author._id.toString(),
                batch: "Uranium",
                organisation: "FunctionUp",
            },
            "functionUp-Uranium"
        )
        res.setHeader("x-api-key", token)
        res.send({ status: true, data: token })
    }
    catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = {
    createAuthor,
    authorLogin
}