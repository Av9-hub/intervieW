import express from "express"
import {ENV} from "./lib/env.js"
import path from "path"
import { connectDb } from "./lib/connection.js";
import {serve} from "inngest/express"
import { inngest ,functions} from "./lib/inngest.js";
import cors from "cors"
import {clerkMiddleware} from '@clerk/express'
import { protectRoute } from "./middlewares/protectRoute.js";
import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js"

const app=express();

const __dirname=path.resolve();

//credentials:true meansing??=> server allows a browser to include cookies on request
app.use(cors({origin:ENV.CLIENT_URL,credentials:true}));

//middleware
app.use(express.json());
app.use(clerkMiddleware()); //This adds auth field to request object: req.auth()


app.use("/api/inngest",serve({client:inngest,functions}))

app.use("/api/chat",chatRoutes);
app.use("/api/session",sessionRoutes);
app.get("/health",(req,res)=>{
    res.status(200).json({msg:"success from backend... heath"})
})



if(ENV.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    //path.join-> join the static path from __dirname to given path
    //express.static serves the file if found else call to next();

    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}
const connectServer=async()=>{
    try{
        await connectDb();
        app.listen(ENV.PORT,()=>{
            console.log("Server is running on port "+ENV.PORT);
        })
    }
    catch(error){
        console.log("FAILED IN SERVER CONNECTION");
    }
}

connectServer();
