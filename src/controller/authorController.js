const authorModel = require('../models/authorModel')

const createAuthor = async function(req,res) {
    try {

        let authorData = req.body
        let saveAuthor = await authorModel.create(authorData)
        res.status( 200 ).send({saveAuthor})
    }
    catch(error) {
        res.status( 500 ).send({msg: error.message})
    }
}

module.exports = {
    createAuthor
}