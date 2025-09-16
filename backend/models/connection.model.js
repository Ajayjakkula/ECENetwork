import mongoose from "mongoose";

const connectionRequestSchema = new mongoose.Schema({
  userId: {  // Who sent the connection request
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  connectionId: {  // To whom the request was sent
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status_accepted: {  // Whether the request is accepted
    type: Boolean,
    default: false
  }
});

const ConnectionRequest = mongoose.model("ConnectionRequest", connectionRequestSchema);

export default ConnectionRequest;
