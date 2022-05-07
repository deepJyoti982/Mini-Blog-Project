const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId

const BlogsSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    body: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    authorId: {
        type: ObjectId,
        ref: 'Author',
        required: true,
        trim: true
    },
    tags: [String],
    category: {
        type: String,
        required: true,
        trim: true
    },
    subcategory: [String],
    createdAt:
    {
        type: Date,
        default: Date.now
    },
    updatedAt:
    {
        type: Date,
        default: null
    },
    deletedAt:
    {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    publishedAt: {
        type: Date,
        default: null
    },
    isPublished: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('BlogsDB', BlogsSchema)
