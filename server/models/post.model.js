import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
    },
    img: {
        type: String
    },
    likes: {
        // Array of user ids
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    replies: [
        // Reply schema
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            username: {
                type: String,
            },
            profilePicture: {
                type: String
            }
        }
    ]

}, {timestamps: true})


const Post = mongoose.model('Post', postSchema)

export default Post