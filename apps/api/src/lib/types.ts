export interface SongResponse {
  item: {
    name: string;
    artists: {
      id: string;
      name: string;
      external_urls: {
        spotify: string;
      };
    }[];
    type: "album" | "single";
    album: {
      name: string;
      images: {
        url: string;
        width: number;
        height: number;
      }[];
      release_date: string;
    };
    external_urls: {
      spotify: string;
    };
    preview_url: string;
  };
  is_playing: boolean;
}

export interface ArtistResponse {
  images: { url: string; width: number; height: number }[];
}

export interface NowPlayingResponse {
  status: number;
  album: string;
  isAlbum: boolean;
  albumImageUrl: string;
  albumImageWidth: number;
  albumImageHeight: number;
  albumReleaseDate: string;
  artists: {
    id: string;
    name: string;
    url: string;
    image: string | null;
  }[];
  isPlaying: boolean;
  songUrl: string;
  title: string;
  songPreviewUrl: string | null;
}
