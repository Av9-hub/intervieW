import {StreamChat} from 'stream-chat'
import { ENV } from './env'
const apiKey=ENV.STREAM_API_KEY
const apiSecret=ENV.STREAM_API_SECRET

if(!apiKey||!apiSecret){
    console.error("Stream API key or API secret is missing..")
}

export const chatClient=StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser=async(userData)=>{
    try{
        await chatClient.upsertUser(userData);
        console.log("Stream user upserted");
    }
    catch(error){
        console.error("Error upserting stream user",error);
    }
}

export const deleteStreamUser=async(userId)=>{
    try{
        await chatClient.deleteUser(userId);
        console.log("Stream user deleted");
    }
    catch(error){
        console.error("Error deleting stream user",error);
    }
}
