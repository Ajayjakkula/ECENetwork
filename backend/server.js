import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import postsRoutes from "./routes/posts.routes.js"
import userRoutes from "./routes/user.routes.js"


dotenv.config({ debug: true });


const app=express();

app.use(cors());


app.use(express.json());
app.use(postsRoutes);
app.use(userRoutes)

const port = process.env.PORT || 8080;
 
const start=async ()=>{
  
       try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    app.listen(port, () => {
      console.log("App is Listening on port 8080");
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // stops app if DB fails
  }
}

start(); 