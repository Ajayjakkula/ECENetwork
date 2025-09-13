import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import postsRoutes from "./routes/posts.routes.js"

dotenv.config();

const app=express();

app.use(cors());

app.use(express.json());

app.use(postsRoutes)
 
const start=async ()=>{
  
       try {
    await mongoose.connect("mongodb+srv://jakkulaajay449:h2Q5VxOuJ9sTycDp@ajay.muv4mcq.mongodb.net/?retryWrites=true&w=majority&appName=Ajay");
    console.log("Connected to MongoDB");
    app.listen(8080, () => {
      console.log("App is Listening on port 8080");
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // stops app if DB fails
  }
}

start(); 