import Post from "../models/posts.model.js"
import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"

export const activeCheck = (req, res) => {
  return res.status(200).json({ message: "Running" });
};

export const createPost=async(req,res)=>{
        const {token}=req.body;
  try{
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const post=new Post({
         userId:user._id,
         body:req.body.body,
         media:req.file!=undefined?req.file.filename:"",
         fileType: req.file != undefined ? req.file.mimetype.split("/") : []

    });

    await post.save();

    return res.status(200).json({message:"Post created"})

  }catch(err){
      return res.status(500).json({ message: err.message });
  }
}


