"use client";

import { authClient } from "@/lib/auth/client";
import { useState } from "react";
import {redirect} from "next/navigation";
import {Button} from "@myy/ui/button";
import Link from "next/link";
import {useRouter} from "next/navigation";

export default function SignInPage() {
    const session = authClient.useSession();

    console.log(session.data)

    if (session.data !== null) {
        redirect("/dashboard");
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const login = async () => {
        try {
            await authClient.signIn.email({
                email,
                password,
            }, {
                onRequest: (ctx) => {
                    // loading ui
                },
                onSuccess: (ctx) => {
                    console.log("LOGIN SUCCESS: ", ctx.data);
                    redirect("/dashboard");
                },
                onError: (ctx) => {
                    if (ctx.error.status === 403) {
                        alert("Please verify your email address");
                    }

                    alert(ctx.error.message);
                },
            })
        } catch (error) {
            console.error("SIGN IN ERROR: ", error);
        }
    };

    return (
        <div>
            <header className="w-full fixed left-0 right-0">
                <div className="ml-5 mt-4 md:ml-10 md:mt-10">
                    LOGO
                </div>
            </header>

            <div className="flex min-h-screen justify-center items-center overflow-hidden p-6 md:p-0">
                <div className="relative z-20 m-auto flex w-full max-w-[380px] flex-col py-8">
                    <div className="flex w-full flex-col relative">
                        <div
                            className="pb-4 bg-gradient-to-r from-primary dark:via-primary dark:to-[#848484] to-[#000] inline-block text-transparent bg-clip-text">
                            <h1 className="font-medium pb-1 text-3xl">Giriş Yap.</h1>
                        </div>

                        <p className="font-medium pb-1 text-2xl text-[#878787]">
                            Durum takibi yapın. <br />
                            Sitenizin durumlarını öğrenin
                        </p>

                        <div className="pointer-events-auto mt-6 flex flex-col gap-2 mb-6">
                            <input type="email" className="px-4 py-2 border border-foreground" placeholder="E-postanız:" onChange={e => setEmail(e.target.value)} />
                            <input type="password" className="px-4 py-2 border border-foreground" placeholder="Şifreniz:" onChange={e => setPassword(e.target.value)} />
                            <Button className="w-full" onClick={login}>Giriş Yap</Button>
                        </div>

                        <div className="w-full mb-8">
                            <Link href="/sign-up" className="w-full px-2 py-1 underline text-lg">Kayıt Ol</Link>
                        </div>

                        <p className="text-xs text-[#878787]">
                            By clicking continue, you acknowledge that you have read and agree to statuspage{" "}
                            <a href="https://midday.ai/terms" className="underline">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="https://midday.ai/policy" className="underline">
                                Privacy Policy
                            </a>
                            .
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}