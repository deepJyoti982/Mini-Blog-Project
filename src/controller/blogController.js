const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const validator = require("../validations/validator")
const jwt = require("jsonwebtoken")



const createBlogs = async function (req, res) {

    try{
        const blogData = req.body
    
        if(!validator.isValidRequestBody(blogData)) {
            return res.status( 400 ).send({status: false, msg: "Invalid request parameters! Please provide blog details"})
        }
    
        const {title,body,authorId,tags,category,subcategory,isPublished} = blogData;
    
        if(!validator.isValid(title)) return res.status( 400 ).send({status: false, msg: "Blog title is required"})
        if(!validator.isValid(body)) return res.status( 400 ).send({status: false, msg: "Blog body is required"})
        if(!validator.isValid(authorId)) return res.status( 400 ).send({status: false, msg: "authorId is required"})
    
        if(validator.isValidObjectId(authorId)) {
            if(!await authorModel.findById(authorId)) {
                return res.status( 400 ).send({status: false, msg: "Author does not exist"})
            }
        }else{
            return res.status( 400 ).send({status: false, msg: `${authorId} is not a valid authorId`})
        } 
    
        if(!validator.isValid(category)) return res.status( 400 ).send({status: false, msg: "Blog category is required"})
    
        const saveBlog = await blogModel.create(blogData)
        res.status( 201 ).send({status: true, msg: "Blog created successfully", data: saveBlog})
    }
    catch( error ) {
        res.status( 500 ).send({status: false, msg: error.message})
    }
}



const getBlogs = async function (req, res) {

    try {
        const dataQuery = req.query
        if (Object.keys(dataQuery).length !== 0) {
    
            let findByQuery = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true },dataQuery] })
    
            if (findByQuery.length == 0) {
    
                return res.status(404).send({ status: false, msg: "No such data found" })
            }
            res.status(200).send({ status: true, data: findByQuery })
    
        } else {
            let findData = await blogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }] })
            // console.log(findData)
            if (!findData) {
                return res.status(404).send({ status: false, msg: "No data found" })
            } else {
                res.status(200).send({ status: true, data: findData })
    
            }
        }
    }
    catch( error ) {
        res.status( 500 ).send({status: false, msg: error.message})
    }
}


let updateBlog = async function (req, res) {

    try {
        const token = (req.headers["x-Api-key"] || req.headers["x-api-key"])
        
        let decodedToken = jwt.verify(token, "functionUp-Uranium")
        let userId = decodedToken.userId
        // console.log(userId)
    
        let blogId = req.params.blogId
        let content = req.body
    
        let blog = await blogModel.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })
    
        if (!blog) {
            return res.status(404).send({ msg: "sorry dear we dont have such blog in our record" })
        }
        let checked = blog.authorId.toString()
        // console.log(checked)
    
        if(userId != checked) return res.status( 401 ).send({msg: "Authorisation failed! You cannot update another author's blog"})
    
        let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: content }, { returnDocument: "after" }).populate('authorId')
        res.status(200).send({ data: updatedBlog })
    }
    catch( error ) {
        res.status( 500 ).send({status: false, msg: error.message})
    }

}

let deleteBlogByBlogId = async function (req, res) {

    try {
        let token = (req.headers["x-Api-key"] || req.headers["x-api-key"])
        
        let decodedToken = jwt.verify(token, "functionUp-Uranium")
        let userId = decodedToken.userId
        // console.log(userId)
    
        let blogId = req.params.blogId
        let blog = await blogModel.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })
    
        if (!blog) {
            return res.status(404).send("no such blog in our record")
        }
    
        let checked = blog.authorId.toString()
        if(userId != checked) return res.status( 401 ).send({msg: "Authorisation failed! You cannot delete another author's blog"})
    
        await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { "isDeleted": true } })
        res.sendStatus(200);
    }
    catch( error ) {
        res.status( 500 ).send({status: false, msg: error.message})
    }
    

}

let deleteBlogByParam = async function (req, res) {

    try {

        let token = (req.headers["x-Api-key"] || req.headers["x-api-key"])
        
        let decodedToken = jwt.verify(token, "functionUp-Uranium")
        let userId = decodedToken.userId
        
    
        let criteria = req.query
        
        let blog = await blogModel.find( { $and: [criteria,{isDeleted: false }] } )
        if (blog.length == 0) {
            return res.status(404).send({ msg: "no such blog" })
        }
        
        let flag = 0
        for(let i = 0; i < blog.length; i++) {
            if(blog[i].authorId.toString() == userId) {
                
                await blogModel.updateOne( {_id: blog[i]._id},{ $set: { "isDeleted": true }} )
                flag = 1
            }
        }
        if(flag == 0) return res.status( 401 ).send({msg: "Authorisation failed! You cannot delete another author's blog"})
        res.sendStatus(200)
    }
    catch( error ) {
        res.status( 500 ).send({status: false, msg: error.message})
    }
    
}


module.exports = {

    createBlogs,
    getBlogs,
    updateBlog,
    deleteBlogByBlogId,
    deleteBlogByParam
    
} 