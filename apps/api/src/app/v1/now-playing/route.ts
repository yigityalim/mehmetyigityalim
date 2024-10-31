import { getNowPlaying } from "@/lib/spotify";
import { type NextRequest, NextResponse } from "next/server";
import type { SongResponse } from "@/lib/types";
import {
  getCorsHeaders,
  methodNotAllowed,
  processNowPlayingData,
  validateAuthorization,
} from "@/lib/utils";

export const runtime = "edge";
export const revalidate = 0;

export async function GET(request: NextRequest): Promise<NextResponse> {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

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
        // FIXME - https://github.com/vercel/next.js/pull/48354
        { status: 200, headers: corsHeaders },
      );
    }

    const song = (await response.json()) as SongResponse;

    if (song.item === null) {
      return NextResponse.json(
        { status: 204 },
        // FIXME - https://github.com/vercel/next.js/pull/48354
        { status: 200, headers: corsHeaders },
      );
    }

    const nowPlayingData = await processNowPlayingData(song, response.status);
    return NextResponse.json(nowPlayingData, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json(
      {
        error: "An error occurred while fetching data",
        status: 500,
        errorMessage: (error as Error).message,
      },
      { status: 500, headers: corsHeaders },
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
    // FIXME - https://github.com/vercel/next.js/pull/48354
    { status: 200, headers: corsHeaders },
  );
}

export const POST = methodNotAllowed;
export const PUT = methodNotAllowed;
export const PATCH = methodNotAllowed;
export const DELETE = methodNotAllowed;
