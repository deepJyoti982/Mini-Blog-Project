const authorModel = require("../models/authorModel")
const blogModel = require("../models/blogModel")



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


const getBlogs = async function (req, res) {

    let dataQuery = req.query
    // let a = Object.keys(dataQuery)
    if (Object.keys(dataQuery).length !== 0) {
        
        let findByQuery = await blogModel.find({$and: [{isDeleted: false}, {isPublished: true}] } && dataQuery)
        
        if (findByQuery.length == 0) {

            return res.status(404).send({ status: false, msg: "No such data found" })
        }
        res.status(200).send({ status: true, data: findByQuery })

    } else {
        let findData = await blogModel.find( {$and:[ {isDeleted: false} ,  {isPublished: true} ]} )
        // console.log(findData)
        if (!findData) {
            return res.status(404).send({ status: false, msg: "No data found" })
        }else {
            res.status(200).send({ status: true, data: findData })
            
        } 
    }
}


let updateBlog = async function (req, res) {
    let blogId = req.params.blogId
    let content = req.body
    let blog = await blogModel.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })
    if (!blog) {
        res.status(404).send({ msg: "sorry dear we dont have such blog in our record" })
    }
    let updatedBlog = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: content }, { returnDocument: "after" })
    res.status(200).send({ data: updatedBlog })
}

let deleteBlogByBlogId = async function (req, res) {
    let blogId = req.params.blogId
    let blog = await blogModel.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })
    if (!blog) {
        return res.status(404).send("no such blog in our record")
    }
    await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { "isDeleted": true } })
    res.sendStatus(200);
}

let deleteBlogByParam = async function (req, res) {
    let criteria = req.query
    let blog = await blogModel.find({isDeleted: false} && criteria)
    if (blog.length == 0) {
        return res.status(404).send({ msg: "no such blog" })
    }
    await blogModel.updateMany(criteria, {$set: {"isDeleted": true}})
    res.sendStatus( 200 )

}



module.exports = {

    createBlogs,
    getBlogs,
    updateBlog,
    deleteBlogByBlogId,
    deleteBlogByParam
} 