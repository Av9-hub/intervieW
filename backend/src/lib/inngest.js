import {Inngest} from "inngest";
import { connectDb } from "./connection.js";
import {User} from "../model/User.js"

//created ingest client
export const inngest =new Inngest({id:"IntervieW"});

const syncUser=inngest.createFunction(
    {id:"sync-user"},
    {event:"clerk/user.created"},
    async ({event})=>{
        await connectDb();
        const {id,email_addresses,first_name,last_name,image_url}=event.data

        const newUser={
            clerkId:id,
            email:email_addresses[0]?.email_addresses,
            name:`${first_name||""} ${last_name||""}`,
            imageUrl:image_url
        }
        //todo

        await User.create(newUser);
    }
)

const deleteUserFromDB=inngest.createFunction(
    {id:"delete-user-from-db "},
    {event:"clerk/user.deleted"},
    async ({event})=>{
        await connectDb();
        const {id}=event.data

        await User.deleteOne({clerkId:id});

        //todo
    }
)

export const functions=[syncUser,deleteUserFromDB]