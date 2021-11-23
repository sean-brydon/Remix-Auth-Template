import {  User } from "@prisma/client";
import { Authenticator, LocalStrategy } from "remix-auth";
import { sessionStorage } from "./session.server";
import { db } from "./utils/db.server";

export let authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
    new LocalStrategy({loginURL:'/login'},async (username,password)=>{
        const user = await db.user.findUnique({where: {username}});
        if(!user) throw new Error('Username or password is incorrect');
        // TODO: Validate password with brcypt
        if(user.password !== password) throw new Error('Username or password is incorrect');
        return user;
    })
    ,"local"
)

