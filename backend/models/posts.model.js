import mongoose from "mongoose"

const postschema=mongoose.Schema({
    userId:{
       type:mongoose.Schema.Types.ObjectId,
       ref:"User"
    },
    body:{
       type:String,
       required:true
    },
    likes:{
       type:Number,
       default:0
    },
    createdAt:{
    type:Date,
    default:Date.now
    },
    updatedAt:{
        type:Date,
    default:Date.now

    },
    media:{
        type:String,
        default:''

    },
    active:{
       type:Boolean,
       default:false
    },
    fileType:{
       type:Boolean,
       default:''
    }
})

const Post=mongoose.model("Post",postschema);

export default Post;