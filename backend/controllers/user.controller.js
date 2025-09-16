import bcrypt from 'bcrypt';
import crypto from 'crypto';
import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import ConnectionRequest from '../models/connection.model.js';

// Register function
export const register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    if (!name || !email || !password || !username)
      return res.status(400).json({ message: "Fill all Fields" });

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username
    });

    await newUser.save();

    // Create and save the profile
    const profile = new Profile({ userId: newUser._id });
    await profile.save();

    return res.status(201).json({ message: "User registered successfully." });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Login function
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = crypto.randomBytes(32).toString("hex");

    await User.updateOne({ _id: user._id }, { token });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req, res) => {
  const { token } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) return res.status(404).json({ message: "User Not Found" });

    user.profilePicture = req.file.filename;
    await user.save();

    return res.status(200).json({ message: "Profile picture updated." });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const { token, ...newUserData } = req.body;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const { username, email } = newUserData;

    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser && String(existingUser._id) !== String(user._id)) {
      return res.status(400).json({ message: "Username or email already in use" });
    }

    Object.assign(user, newUserData);
    await user.save();

    return res.status(200).json({ message: "Profile updated successfully", user });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get user and profile
export const getUserandProfile = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Optionally, you can fetch the profile here if needed
    const profile = await Profile.findOne({ userId: user._id });

    await profile.save();

    return res.status(200).json({
      username: user.username,
      email: user.email,
      profile: profile ? profile : {}
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const sendConnectionRequest = async (req, res) => {
  const { token, connectionId } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const connectionUser = await User.findOne({ _id: connectionId });
    if (!connectionUser) {
      return res.status(404).json({ message: "Connection User Not Found" });
    }

    const existingRequest = await ConnectionRequest.findOne({
      userId: user._id,
      connectionId: connectionUser._id
    });

    if (existingRequest) {
      return res.status(200).json({ message: "Request already sent" });
    }

    const request = new ConnectionRequest({
      userId: user._id,
      connectionId: connectionUser._id,
    });

    await request.save();

    return res.status(201).json({ message: "Request sent successfully" });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getMyConnectionRequests=async(req,res)=>{

  const {token}=req.body;
  try{
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const connections=await ConnectionRequest.findOne({userId:user._id})
                      .populate('connectionId','name username email profilePicture')
    
    return res.json({connections});
   
  }catch(err){
    return res.status(500).json({ message: err.message });
  }
};

export const  whatAreMyConnections=async (req,res)=>{
    const {token}=req.body;
  try{
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const connections=await ConnectionRequest.findOne({connectionId:user._id}) //Muje kis kis ne bheja 
                      .populate('userId','name username email profilePicture')
    
    return res.json({connections});

  }catch(err){
      return res.status(500).json({ message: err.message });
  }
};

export const acceptConnections=async(req,res)=>{
      const {token,requestId,action_type}=req.body;
  try{
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
  const connection=await ConnectionRequest.findOne({_id:requestId});
  
  if(!connection){
    res.status(404).json({message:"Connection Not Found"})
  }

  if(action_type==="accept"){
    connection.status_accepted=true;
  }else connection.status_accepted=false;

  await connection.save(); 

  return res.json({message:"request updated"});
     

  }catch(err){
      return res.status(500).json({ message: err.message });
  }
}
