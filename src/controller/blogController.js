const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")
const jwt = require("jsonwebtoken")



const createBlogs = async function (req, res) {

    let data = req.body

    let Author = await authorModel.findById(data.authorId)
    if (!Author) {
        res.status(400).send({ status: false, message: "Author_Id not found" })
    } else {
        let savedblog = await blogModel.create(data)
        res.status(201).send({ status: true, data: savedblog })
    }
}



const authorLogin = async function (req, res) {

    try {

        let email = req.body.email
        let password = req.body.password

        let author = await authorModel.findOne({ email: email, password: password })
        if (!author) {
            return res.send({ status: false, msg: "username or the password is not correct" })
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



const getBlogs = async function (req, res) {

    let dataQuery = req.query
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


let updateBlog = async function (req, res) {

    let token = (req.headers["x-Api-key"] || req.headers["x-api-key"])
    
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

    if(userId != checked) return res.status( 401 ).send({msg: "Unauthorised user"})

    let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: content }, { returnDocument: "after" }).populate('authorId')
    res.status(200).send({ data: updatedBlog })
}

let deleteBlogByBlogId = async function (req, res) {
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
    if(userId != checked) return res.status( 401 ).send({msg: "Unauthorised user"})

    await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { "isDeleted": true } })
    res.sendStatus(200);
    

}

let deleteBlogByParam = async function (req, res) {

    let token = (req.headers["x-Api-key"] || req.headers["x-api-key"])
    
    let decodedToken = jwt.verify(token, "functionUp-Uranium")
    let userId = decodedToken.userId
    

    let criteria = req.query
    
    let blog = await blogModel.find( { $and: [criteria,{isDeleted: false }] } )
    if (blog.length == 0) {
        return res.status(404).send({ msg: "no such blog" })
    }
    
    let flag = 0
    for(i = 0; i < blog.length; i++) {
        if(blog[i].authorId.toString() == userId) {
            
            await blogModel.updateOne( {_id: blog[i]._id},{ $set: { "isDeleted": true }} )
            flag = 1
        }
    }
    if(flag == 0) return res.status( 401 ).send({msg: "Authorisation failed! You cannot delete another author's blog"})
    res.sendStatus(200)
    
}


module.exports = {

    createBlogs,
    getBlogs,
    updateBlog,
    deleteBlogByBlogId,
    deleteBlogByParam,
    authorLogin
} 