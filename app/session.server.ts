import { createCookieSessionStorage } from "remix";

// TODO: Make sure you have your own secret stored in the enviroment variables
export let sessionStorage = createCookieSessionStorage({
    cookie:{
        name: 'session',
        sameSite: 'lax',
        path: '/',
        httpOnly: true,
        secrets: [process.env.SESSION_SECRET ?? 'eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ'],
        secure: process.env.NODE_ENV === "production",
    }
})


export let {getSession,commitSession,destroySession} = sessionStorage;