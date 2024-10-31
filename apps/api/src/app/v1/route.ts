import { NextResponse } from "next/server";

const data = {
  error: "Global API route not published",
  status: 404,
} as const;

const res = NextResponse.json<typeof data>(data, { status: 404 });

export const GET = async () => res;
export const POST = async () => res;
export const PUT = async () => res;
export const PATCH = async () => res;
export const DELETE = async () => res;
