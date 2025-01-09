"use client";

import { authClient } from "@/lib/auth/client";
import { useRouter } from "next/navigation";

export function SignOutButton() {
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                },
            },
        });
    };

    return (
        <button onClick={handleSignOut}>çıkış yap</button>
    )
}