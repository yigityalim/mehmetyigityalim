"use client"
import { authClient } from "@/lib/auth/client";
import { useState } from 'react';
import {Input} from "@myy/ui/input";
import {Button} from "@myy/ui/button";
import {redirect} from "next/navigation";

export default function SignUp() {

    const session = authClient.useSession();

    if (session.data) redirect("/dashboard");

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState<{}>();

    const signUp = async () => {
        const { data, error } = await authClient.signUp.email({
            email,
            password,
            name,
        }, {
            onRequest: (ctx) => {
                //show loading
            },
            onSuccess: (ctx) => {
                console.log("SUCCESS: ", ctx)
            },
            onError: (ctx) => {
                setError(ctx)
            },
        });

        if (error) {
            setError(error)
        }

        console.log(data)
    };

    return (
        <div className="w-full flex flex-col gap-2 items-center justify-center">
            <input className="w-full px-4 py-2 rounded" type="name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="w-full px-4 py-2 rounded" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input className="w-full px-4 py-2 rounded" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="w-full px-4 py-2 bg-foreground text-background" onClick={signUp}>Sign Up</button>
        </div>
    );
}