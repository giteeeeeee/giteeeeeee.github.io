/**
 * Media Configuration
 *
 * The plog/gallery content lives in `src/content/plog`.
 * This file keeps global media settings that are not content entries.
 */

export const musicConfig: MusicConfig = {
  player: {
    defaultTrackId: '',
    autoAdvance: true,
  },
  playlists: [],
  tracks: [],
};

export const mediaConfig = {
  music: musicConfig,
} satisfies MediaConfig;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MusicPlaylist {
  id: string;
  title: string;
  description: string;
  icon: string;
  accent: string;
}

export interface MusicTrack {
  id: string;
  playlistId: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  src?: string;
  cover?: string;
  tone: 'focus' | 'calm' | 'warm' | 'pulse';
  tags: string[];
  accent: string;
  featured?: boolean;
}

export interface MusicConfig {
  player: {
    defaultTrackId: string;
    autoAdvance: boolean;
  };
  playlists: MusicPlaylist[];
  tracks: MusicTrack[];
}

export interface MediaConfig {
  music: MusicConfig;
}
