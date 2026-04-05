
export async function getStreamToken(req,res){
    try{
        const token=chatClient.createToken(req.user.clerkId);
        res.status(200).json(
            {
                token,
                userId:req.user.clerkId,
                userName:req.user.name,
                userImage:req.user.imageUrl
            }
        );
    }
    catch(error){
        console.log("Error is getStreamToken controller",error.message);
        res.status(500).json({message:"Internal server Error"})
    }
}