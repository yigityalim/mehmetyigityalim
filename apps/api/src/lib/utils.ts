import { type NextRequest, NextResponse } from "next/server";
import { getArtist } from "./spotify";
import type { ArtistResponse, NowPlayingResponse, SongResponse } from "./types";

export const apiToken = process.env.AUTH_TOKEN;

export function isAuthorized(request: Request): boolean {
  const authorization = request.headers.get("Authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return false;
  }

  if (!apiToken) {
    throw new Error("`Token` not found.");
  }

  const token = authorization.split("Bearer ")[1];
  if (!token) return false;
  return token === apiToken;
}

export function validateAuthorization(
  request: NextRequest,
): NextResponse | null {
  if (!isAuthorized(request)) {
    return new NextResponse(
      JSON.stringify({ status: "Unauthorized", code: 401 }),
      {
        status: 401,
        headers: {
          "WWW-Authenticate":
            'Bearer realm="Access to the protected resource", charset="UTF-8"',
        },
      },
    );
  }

  return null;
}

export const allowedOrigins = [
  process.env.NODE_ENV === "production" ? null : "http://localhost:3000", // FIXME - Remove this in production
  "https://mehmetyigityalim.com",
  "https://v2.mehmetyigityalim.com",
  "https://api.mehmetyigityalim.com",
] as const;
type AllowedOrigin = (typeof allowedOrigins)[number];

export function getCorsHeaders(origin: string | null): HeadersInit {
  const isOriginAllowed =
    origin && allowedOrigins.includes(origin as AllowedOrigin);

  return {
    "Access-Control-Allow-Origin": isOriginAllowed ? origin : "null",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function processNowPlayingData(
  song: SongResponse,
  status: number,
): Promise<NowPlayingResponse> {
  const artistsData = await fetchArtistsData(song.item.artists);

  return {
    status,
    album: song.item.album.name,
    isAlbum: song.item.type === "album",
    albumImageUrl: song.item.album.images[0]?.url ?? "",
    albumImageWidth: song.item.album.images[0]?.width ?? 300,
    albumImageHeight: song.item.album.images[0]?.height ?? 300,
    albumReleaseDate: song.item.album.release_date,
    artists: artistsData ?? [],
    isPlaying: song.is_playing,
    songUrl: song.item.external_urls.spotify,
    title: song.item.name,
    songPreviewUrl: song.item.preview_url,
  };
}

export async function fetchArtistsData(
  artists: SongResponse["item"]["artists"],
) {
  const artistPromises = artists.map(async (artist) => {
    try {
      const artistResponse = await getArtist(artist.id);
      const artistData = (await artistResponse.json()) as ArtistResponse;
      return {
        id: artist.id,
        name: artist.name,
        url: artist.external_urls.spotify,
        image: artistData.images[0]?.url ?? null,
      };
    } catch (error) {
      return {
        id: artist.id,
        name: artist.name,
        url: artist.external_urls.spotify,
        image: null,
      };
    }
  });

  return Promise.all(artistPromises);
}

export function methodNotAllowed(): NextResponse<{
  error: string;
  status: number;
}> {
  return NextResponse.json(
    { error: "Method Not Allowed", status: 405 },
    { status: 405, headers: { Allow: "GET, OPTIONS" } },
  );
}

export function getIpAddress(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }

  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp) {
    return cfIp;
  }

  const trueClientIp = request.headers.get('true-client-ip');
  if (trueClientIp) {
    return trueClientIp;
  }

  const remoteAddr = request.headers.get('x-real-ip');
  if (remoteAddr) {
    return remoteAddr;
  }

  return '127.0.0.1';
}
