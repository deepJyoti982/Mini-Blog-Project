const express = require('express');
const router = express.Router();
const authorController = require('../controller/authorController')
const blogController = require('../controller/blogController')
const middleWare = require('../middleware/auth')

router.post('/author',authorController.createAuthor)
router.post('/userLogin', blogController.authorLogin)

router.post("/createBlog", middleWare.tokenValidator, blogController.createBlogs)
router.get("/getBlog", middleWare.tokenValidator, blogController.getBlogs)
router.put("/updateBlog/:blogId",middleWare.tokenValidator, blogController.updateBlog)
router.delete("/deleteBlog/:blogId",middleWare.tokenValidator, blogController.deleteBlogByBlogId)
router.delete("/deleteBlogByParams", middleWare.tokenValidator, blogController.deleteBlogByParam)



module.exports = router;