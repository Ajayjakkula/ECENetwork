import mongoose, { mongo } from "mongoose"


const connectionRequest=new mongoose.Schema({
    userId:{  //Who sent the connection Request
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    connectionId:{  ///To whom he Sent the Request 
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status_accepted:{
        type:Boolean,
        default:false
    }
});


const ConnectionRequest=mongoose.model("ConnectionRequest",connectionRequest);

export default ConnectionRequest;