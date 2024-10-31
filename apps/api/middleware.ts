import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  return NextResponse.redirect(new URL("/api", req.url));
}

export const config = {
  matcher: /^\/api\/?$/,
};
