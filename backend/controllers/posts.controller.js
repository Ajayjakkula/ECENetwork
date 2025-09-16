import Post from "../models/posts.model.js"
import User from "../models/user.model.js"
import Profile from "../models/profile.model.js"
import Comment from "../models/comments.model.js"

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
};

export const getAllPosts=async(req,res)=>{
  try{

    const posts=await Post.find({}).populate('userId','name username email profilePicture');
    return res.status(200).json({posts})

  }catch(err){
    return res.status(500).json({ message: err.message });
  }
};

export const deletePost=async (req,res)=>{
  const {token,post_id}=req.body;
  try{

    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

   const post=await Post.findOne({_id:post_id});
   if(!post)return res.status(404).json({message:"Post Not Found"});

   if(post.userId.toString()!=user._id.toString()){
    return res.status(401).json({message:"Unauthorized"});
   }

    await Comment.deleteMany({ postId: post._id });

   await Post.deleteOne({_id:post_id});

   return res.status(200).json({message:"Deleted Successfully"})


  }catch(err){
    return res.status(500).json({ message: err.message });
  }
};


export const commentPost = async (req, res) => {
  const { token, post_id, comment } = req.body;

  try {
    // Find user by token
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Find post by id
    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    // Create new comment
    const newComment = new Comment({
      userId: user._id,
      postId: post._id,
      body: comment // use destructured 'comment'
    });

    await newComment.save();

    return res.status(200).json({ message: "Added Comment" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



export const deleteComment = async (req, res) => {
  const { token, post_id, comment_id } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const post = await Post.findOne({ _id: post_id });
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }

    const comment = await Comment.findOne({ _id: comment_id });
    if (!comment) {
      return res.status(404).json({ message: "Comment Not Found" });
    }

    if (comment.userId.toString() !== user._id.toString() &&
        post.userId.toString() !== user._id.toString()) {
      return res.status(401).json({ message: "Not Authorized" });
    }

    await Comment.deleteOne({ _id: comment_id });

    return res.status(200).json({ message: "Comment Deleted" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const getAllCommentsOfPost = async (req, res) => {
  const { token, post_id } = req.body;

  try {
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    const comments = await Comment.find({ postId: post._id })
      .populate('userId', 'name username email profilePicture') 
      .sort({ createdAt: 1 }); 

    return res.status(200).json({ comments });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const incLikes=async(req,res)=>{
    const { post_id } = req.body;

  try {
    const post = await Post.findById(post_id);
    if (!post) {
      return res.status(404).json({ message: "Post Not Found" });
    }
    post.likes+=1;

    await post.save();

    return res.status(200).json({message:"Likes Count Incremented" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}


