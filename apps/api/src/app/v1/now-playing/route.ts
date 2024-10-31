import { getNowPlaying } from "@/lib/spotify";
import { type NextRequest, NextResponse } from "next/server";
import type { SongResponse } from "@/lib/types";
import {
  getCorsHeaders,
  methodNotAllowed,
  processNowPlayingData,
  validateAuthorization,
  getIpAddress,
} from "@/lib/utils";
import { ratelimit } from "@/lib/redis";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  const ip = getIpAddress(request);
  const { success, limit, reset, remaining } = await ratelimit.limit(ip);


  if (!success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        status: 429,
        limit,
        reset,
        remaining,
      },
      {
        status: 429,
        headers: {
          ...corsHeaders,
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        }
      }
    );
  }

  // Validate the request authorization
  const unauthorizedResponse = validateAuthorization(request);
  if (unauthorizedResponse) {
    return unauthorizedResponse;
  }

  try {
    const response = await getNowPlaying();

    if (response.status === 204) {
      return NextResponse.json(
        {
          status: 204,
          message: "No song is currently playing.",
          message_tr: "Şu anda hiçbir şarkı çalmıyor.",
        },
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          }
        },
      );
    }

    const song = (await response.json()) as SongResponse;

    if (song.item === null) {
      return NextResponse.json(
        { status: 204 },
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
          }
        },
      );
    }

    const nowPlayingData = await processNowPlayingData(song, response.status);
    return NextResponse.json(nowPlayingData, {
      status: 200,
      headers: {
        ...corsHeaders,
        "X-RateLimit-Limit": limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      }
    });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      {
        error: "An error occurred while fetching data",
        status: 500,
        errorMessage: (error as Error).message,
      },
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        }
      }
    );
  }
}

export async function OPTIONS(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  return NextResponse.json(
    {
      method: "OPTIONS",
    },
    { status: 200, headers: corsHeaders },
  );
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
