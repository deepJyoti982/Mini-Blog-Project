const express = require('express');
const router = express.Router();
const authorController = require('../controller/authorController')
const blogController = require('../controller/blogController')

router.post('/author',authorController.createAuthor)
router.post("/createBlog",blogController.createBlogs)
router.get("/getBlog",blogController.getBlogs)
router.put("/updateBlog/:blogId",blogController.updateBlog)
router.delete("/deleteBlog/:blogId",blogController.deleteBlogByBlogId)
router.delete("/deleteBlogByParams",blogController.deleteBlogByParam)



module.exports = router;