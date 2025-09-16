import mongoose from "mongoose";

// Education Schema
const educationSchema = new mongoose.Schema({
  school: {
    type: String,
    default: ""
  },
  degree: {
    type: String,
    default: ""
  },
  fieldOfStudy: {
    type: String,
    default: ""
  }
});

// Profile Schema
const ProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  bio: {
    type: String,
    default: ""
  },
  currentPost: {
    type: String,
    default: ""
  },
  education: {
    type: [educationSchema],
    default: []
  }
});

const Profile = mongoose.model("Profile", ProfileSchema);

export default Profile;
