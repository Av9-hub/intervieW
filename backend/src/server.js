import express from "express"
import {ENV} from "./lib/env.js"
import path from "path"

const app=express();

const __dirname=path.resolve();

app.get("/health",(req,res)=>{
    res.status(200).json({msg:"success from backend... heath"})
})

app.get("/books",(req,res)=>{
    res.status(200).json({msg:"api is running books"})
})

if(ENV.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));
    //path.join-> join the static path from __dirname to given path
    //express.static serves the file if found else call to next();

    app.get("/{*any}",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend","dist","index.html"));
    });
}

app.listen(ENV.PORT,()=>console.log("Server is running on port "+ENV.PORT));