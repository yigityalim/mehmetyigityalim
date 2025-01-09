import {authClient} from "@/lib/auth/client";
import {headers} from "next/headers";
import {cache} from "react";

export const getSession = cache(async () => {
    return await authClient.getSession({
        fetchOptions: {
            headers: await headers(),
        },
    });
});