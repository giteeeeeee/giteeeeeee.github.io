/**
 * Media Configuration
 *
 * The plog/gallery content lives in `src/content/plog`.
 * This file keeps global media settings that are not content entries.
 */

export const musicConfig = {
  player: {
    defaultTrackId: 'background-music',
    autoAdvance: true,
  },
  playlists: [
    {
      id: 'background',
      title: '背景音乐',
      description: '站点背景音乐播放列表。',
      icon: 'i-carbon:music',
      accent: '#2563eb',
    },
  ],
  tracks: [
    {
      id: 'background-music',
      playlistId: 'background',
      title: 'Background Music',
      artist: 'Your Artist',
      album: 'Site Playlist',
      duration: '00:00',
      durationSeconds: 0,
      src: '/audio/background.mp3',
      cover: '',
      tone: 'calm',
      tags: ['Background'],
      accent: '#2563eb',
      featured: true,
    },
  ],
} satisfies MusicConfig;

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
