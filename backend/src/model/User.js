import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:"String",
        required:true,
        unique:true
    },
    imageUrl:{
        type:"String",
        default:""
    },
    clerkId:{
        type:"String",
        required:true,
        unique:true,
    }

},
{timestamps:true})//createdAt,updatedAt