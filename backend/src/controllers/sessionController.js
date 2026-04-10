import { Session } from "../model/Session.js";
import { streamClient,chatClient } from '../lib/stream.js';

export async function createSession (req,res){
    try{
    const {problem,difficulty}=req.body;
    if(!problem||!difficulty){
        return res.status(400).json({message:"Problem and difficulty are required"});
    }
    const userId=req.user._id;
    const clerkId=req.user.clerkId;

    // generate a unique call id for stream video
    const callId=`session_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const session=await Session.create({
        problem,
        difficulty,
        host:userId,
        callId
    })

    if(!session){
        throw new Error("Session creation failed");
    }

     //create a stream video call 
    await streamClient.video.call("default",callId).getOrCreate({
        data:{
            created_by_id:clerkId,
            custom:{
                problem,
                difficulty,
                sessionId:session._id.toString()
            },
        }
    })

    //create a chat feature
    const channel=chatClient.channel("messaging",callId,{
        name:`${problem} Session`,
        created_by_id:clerkId,
        members:[clerkId]
    })

    await channel.create();

    return res.status(201).json({session})
}
catch(error){
    console.log("Error in createSession controller:", error.message);
    return res.status(500).json({message:"Internal Server Error"});
}
}

export async function getActiveSessions(req,res){
    try{
    const session=await session.find({status:"active"})
    .populate("host","name imageUrl email clerkId")
    .sort({createdAt:-1})
    .limit(20)

    return res.status(202).json({session});}
    catch(error){
        console.log("Error in get active session controller ",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}

export async function getMyRecentSessions(req,res){
    try{
        const userId=req.user._id
        const session=await session.find({
            status:completed,
            $or:[{host:userId},{participants: userId}]
        }).populate("host","name imageUrl email clerkId")
        .sort({createdAt:-1})
        .limit(20);
        res.status(202).json({session});
    }
    catch(error){
        console.log("Error in get active session controller ",error.message);
        return res.status(500).json({message:"Internal server error"});
    }
}

export async function getSessionById(req,res){
    try{
    const {id}=req.params;

    const session=await Session.findById(id)
    .populate("host","name imageUrl email clerkId")
    .sort({createdAt:-1})
    .limit(20)

    return res.status(200).json(session);
    }
    
    catch(error){
        console.log("Error in getSessionById",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function joinSession(req,res){
    try{
    const {id}=req.params;
    const userId=req.user._id;
    const clerkId=req.user.clerkId; 
    const session=await Session.findById(id);
    if(!session){
        return res.status(402).json({message:"session not found"}); 
    }
    if(session.status!=="active"){
        return res.status(402).json({message:"Can't join inactive session "});
    }
    if(session.host.toString()===userId.toString()){
        return res.status(402).json({message:"Host can't join as participant "});
    }
    if(session.participants){
        return res.status(409).json({message:"Already joined by participants."})
    }
    session.participants=userId;
    await session.save();

    const channel=chatClient.channel("messaging",session.callId);
    await channel.addMembers([clerkId]);

    res.status(202).json({session});
}
    catch(error){
        console.log("Error in join session",error.message);
        return res.status(500).json({message:"Internal server problem"})
    }
}

export async function endSession(req,res){
    try{
        const {id}=req.params;
        const userId=req.user._id;
        const session=await Session.findById(id);
         if(!session){
            return res.status(402).json({message:"Cant find session"});
         }

         if(session.host.toString()!==userId.toString()){
            return res.status(402).json({message:"Only host can terminate the session"});
         }
         if(session.status==="completed"){
            return res.status(402).json({message:"Cant terminate ended session"})
         }


         const call=streamClient.video.call("default",session.callId);
         await call.delete({hard:true});

         const channel=chatClient.channel("messaging",session.callId);
         await channel.delete();

         session.status="completed";
         await session.save();

         return res.status(200).json({session,message:"Session ended successfully "});

    }
    catch(error){
        console.log("Error in endSession controller: ",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}