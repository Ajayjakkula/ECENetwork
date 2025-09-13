
import mongoose from "mongoose"

const usersSchema=mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  username:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true
  },
  active:{
    type:Boolean,
    default:false,
  },
  password:{
    type:String,
    require:true
  },
  profilePicture:{
    type:String,
    default:''
  },
  createdAt:{
    type:Date,
    default:Date.now
  },
  token:{
    type:String,
    default:''
  }
})

const User=mongoose.model("User",usersSchema);

export default User;