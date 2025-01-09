import {auth} from "@/lib/auth/server";
import {toNextJsHandler} from "better-auth/next-js";
import {NextRequest} from "next/server";

export const { GET } = toNextJsHandler(auth);

export const POST = async (req: NextRequest) => {
    return await auth.handler(req);
};