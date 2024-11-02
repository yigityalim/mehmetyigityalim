const basic = Buffer.from(
  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
).toString("base64");

export async function getAccessToken(): Promise<{ access_token: string }> {
  const response = await fetch(
    `https://accounts.spotify.com/api/token?grant_type=refresh_token&refresh_token=${process.env.SPOTIFY_REFRESH_TOKEN}`,
    {
      method: "POST",
      next: { revalidate: 60 * 60 },
      headers: {
        Authorization: `Basic ${basic}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return (await response.json()) as { access_token: string };
}

export async function getNowPlaying() {
  const { access_token } = await getAccessToken();

  return fetch("https://api.spotify.com/v1/me/player/currently-playing", {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-store",
  });
}

export async function getArtist(artistId: string) {
  const { access_token } = await getAccessToken();

  return fetch(`https://api.spotify.com/v1/artists/${artistId}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    cache: "no-store",
  });
}

interface TopTracks {
  tracks: {
    artist: string;
    songUrl: string;
    cover: string;
    title: string;
  }[];
}

export interface ResponseTrackType {
  artists: {
    name: string;
  }[];
  name: string;
  external_urls: {
    spotify: string;
  };
  album: {
    images: {
      url: string;
    }[];
  };
}

export async function getTopTracks(): Promise<TopTracks> {
  const { access_token } = await getAccessToken();

  const response = await fetch(
    "https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=long_term",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      cache: "no-store",
    },
  );

  const { items } = (await response.json()) as { items: ResponseTrackType[] };

  const tracks = items.slice(0, 10).map((track: ResponseTrackType) => ({
    artist: track.artists.map((_artist) => _artist.name).join(", "),
    songUrl: track.external_urls.spotify,
    cover: track.album.images[1]?.url,
    title: track.name,
  }));

  return { tracks } as TopTracks;
}
