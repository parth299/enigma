'use client' 

import { useSession, signIn, signOut } from "next-auth/react"
export default function Component() {
    const {data: session} = useSession();
    if(session) {
        return (
            <>
                Signed in as {session.user.username} <br />
                <button onClick={() => signOut()}>Sign Out</button>
            </>
        )
    }
    return (
        <>
            Not Signed In <br />
            <button onClick={() => signIn()}>Sign In</button>
        </>
    )
}