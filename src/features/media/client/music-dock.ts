type Cleanup = () => void;

type MusicDockTrack = {
  id: string;
  playlistId: string;
  playlistTitle: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
  durationSeconds: number;
  src?: string;
  cover?: string;
};

type MusicDockConfig = {
  tracks: MusicDockTrack[];
  defaultTrackId: string;
  autoAdvance: boolean;
  labels: {
    play: string;
    pause: string;
    expand: string;
    collapse: string;
  };
};

function readConfig(dock: HTMLElement): MusicDockConfig | null {
  const source = dock.querySelector<HTMLScriptElement>('[data-music-dock-config]');
  if (!source?.textContent) return null;

  try {
    return JSON.parse(source.textContent) as MusicDockConfig;
  } catch (error) {
    console.error('[MusicDock] Invalid client configuration.', error);
    return null;
  }
}

function formatTime(seconds: number) {
  const value = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(value / 60).toString().padStart(2, '0');
  const remainder = (value % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export function initMusicDock(): Cleanup | null {
  const dock = document.querySelector<HTMLElement>('[data-music-dock]');
  if (!dock || dock.dataset.initialized === 'true') return null;

  const config = readConfig(dock);
  if (!config?.tracks.length) return null;

  dock.dataset.initialized = 'true';

  const controller = new AbortController();
  const { signal } = controller;
  const tracks = config.tracks;
  const trigger = dock.querySelector<HTMLButtonElement>('[data-dock-action="toggle"]');
  const panel = dock.querySelector<HTMLElement>('[data-dock-panel]');
  const audio = dock.querySelector<HTMLAudioElement>('[data-dock-audio]');
  const title = dock.querySelector<HTMLElement>('[data-dock-title]');
  const artist = dock.querySelector<HTMLElement>('[data-dock-artist]');
  const playlist = dock.querySelector<HTMLElement>('[data-dock-playlist]');
  const currentTimeLabel = dock.querySelector<HTMLElement>('[data-dock-current-time]');
  const durationLabel = dock.querySelector<HTMLElement>('[data-dock-duration]');
  const seek = dock.querySelector<HTMLInputElement>('[data-dock-seek]');
  const volume = dock.querySelector<HTMLInputElement>('[data-dock-volume]');
  const playButtons = Array.from(dock.querySelectorAll<HTMLButtonElement>('[data-dock-action="play"]'));
  const playIcons = Array.from(dock.querySelectorAll<HTMLElement>('[data-dock-play-icon]'));
  const trackRows = Array.from(dock.querySelectorAll<HTMLButtonElement>('[data-dock-track-id]'));
  const playlistButtons = Array.from(dock.querySelectorAll<HTMLButtonElement>('[data-dock-playlist-filter]'));

  let storedTrackId = '';
  try {
    storedTrackId = localStorage.getItem('reay-music-track') || '';
  } catch {
    // Storage is optional.
  }

  let currentIndex = Math.max(
    0,
    tracks.findIndex((track) => track.id === (storedTrackId || config.defaultTrackId)),
  );
  let currentFilter = 'all';
  let isPlaying = false;
  let currentTime = 0;

  const listen = (
    target: EventTarget | null,
    type: string,
    listener: EventListener,
    options: AddEventListenerOptions = {},
  ) => {
    target?.addEventListener(type, listener, { ...options, signal });
  };

  const getVisibleTrackIndexes = () => tracks
    .map((track, index) => ({ track, index }))
    .filter(({ track }) => currentFilter === 'all' || track.playlistId === currentFilter)
    .map(({ index }) => index);

  const updatePlayState = (nextPlaying: boolean) => {
    isPlaying = nextPlaying;
    dock.classList.toggle('is-playing', isPlaying);
    playIcons.forEach((icon) => {
      icon.className = isPlaying ? 'i-carbon:pause-filled' : 'i-carbon:play-filled';
    });
    playButtons.forEach((button) => {
      button.setAttribute('aria-label', isPlaying ? config.labels.pause : config.labels.play);
    });
  };

  const updateProgress = (seconds: number) => {
    const track = tracks[currentIndex];
    currentTime = Math.min(Math.max(0, seconds || 0), track.durationSeconds);
    if (seek) seek.value = String(currentTime);
    if (currentTimeLabel) currentTimeLabel.textContent = formatTime(currentTime);
    if (durationLabel) durationLabel.textContent = track.duration || formatTime(track.durationSeconds);
  };

  const renderTrack = (track: MusicDockTrack) => {
    const background = track.cover
      ? `url(${JSON.stringify(track.cover)})`
      : 'var(--reay-music-cover-gradient)';

    dock.style.setProperty('--dock-cover', background);
    if (title) title.textContent = track.title;
    if (artist) artist.textContent = `${track.artist} · ${track.album}`;
    if (playlist) playlist.textContent = track.playlistTitle;
    if (seek) {
      seek.max = String(track.durationSeconds);
      seek.value = '0';
    }
    if (durationLabel) durationLabel.textContent = track.duration;

    trackRows.forEach((row) => {
      row.classList.toggle('is-active', row.dataset.dockTrackId === track.id);
    });

    try {
      localStorage.setItem('reay-music-track', track.id);
    } catch {
      // Storage is optional.
    }
  };

  const pauseCurrent = () => {
    if (audio) {
      currentTime = audio.currentTime || currentTime;
      audio.pause();
    }
    updatePlayState(false);
    updateProgress(currentTime);
  };

  const playCurrent = async () => {
    const track = tracks[currentIndex];
    if (!track.src || !audio) {
      updatePlayState(false);
      return;
    }

    try {
      if (!audio.getAttribute('src')) {
        audio.src = track.src;
        audio.volume = Number(volume?.value || 0.62);
        audio.load();
      }
      audio.currentTime = currentTime;
      await audio.play();
      updatePlayState(true);
    } catch {
      updatePlayState(false);
    }
  };

  const loadTrack = (index: number, shouldPlay: boolean) => {
    if (audio) {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
    }

    updatePlayState(false);
    currentIndex = (index + tracks.length) % tracks.length;
    currentTime = 0;
    renderTrack(tracks[currentIndex]);
    updateProgress(0);

    if (shouldPlay) void playCurrent();
  };

  const stepTrack = (direction: number, shouldPlay: boolean) => {
    let visible = getVisibleTrackIndexes();
    if (!visible.length) visible = tracks.map((_, index) => index);
    const position = visible.indexOf(currentIndex);
    const nextPosition = position >= 0 ? position + direction : 0;
    loadTrack(visible[(nextPosition + visible.length) % visible.length], shouldPlay);
  };

  const setExpanded = (expanded: boolean) => {
    if (panel) panel.hidden = !expanded;
    dock.classList.toggle('is-expanded', expanded);
    if (trigger) {
      trigger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      trigger.setAttribute('aria-label', expanded ? config.labels.collapse : config.labels.expand);
    }
  };

  dock.querySelectorAll<HTMLElement>('[data-dock-action="toggle"]').forEach((button) => {
    listen(button, 'click', () => setExpanded(panel?.hidden === true));
  });

  listen(document, 'click', (event) => {
    if (!dock.classList.contains('is-expanded')) return;
    if (event.target instanceof Node && dock.contains(event.target)) return;
    setExpanded(false);
  });

  listen(document, 'keydown', (event) => {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Escape' && dock.classList.contains('is-expanded')) {
      setExpanded(false);
      trigger?.focus();
    }
  });

  playButtons.forEach((button) => {
    listen(button, 'click', () => {
      if (isPlaying) pauseCurrent();
      else void playCurrent();
    });
  });

  listen(dock.querySelector('[data-dock-action="prev"]'), 'click', () => stepTrack(-1, isPlaying));
  listen(dock.querySelector('[data-dock-action="next"]'), 'click', () => stepTrack(1, isPlaying));

  trackRows.forEach((row) => {
    listen(row, 'click', () => {
      const index = tracks.findIndex((track) => track.id === row.dataset.dockTrackId);
      if (index >= 0) loadTrack(index, true);
    });
  });

  playlistButtons.forEach((button) => {
    listen(button, 'click', () => {
      currentFilter = button.dataset.dockPlaylistFilter || 'all';
      playlistButtons.forEach((item) => item.classList.toggle('is-active', item === button));
      trackRows.forEach((row) => {
        row.hidden = currentFilter !== 'all' && row.dataset.dockPlaylistId !== currentFilter;
      });
    });
  });

  listen(seek, 'input', () => {
    const nextTime = Number(seek?.value || 0);
    currentTime = nextTime;
    if (tracks[currentIndex].src && audio) audio.currentTime = nextTime;
    updateProgress(nextTime);
  });

  listen(volume, 'input', () => {
    if (audio) audio.volume = Number(volume?.value || 0);
  });

  listen(audio, 'timeupdate', () => {
    if (tracks[currentIndex].src && audio) updateProgress(audio.currentTime || 0);
  });

  listen(audio, 'loadedmetadata', () => {
    const track = tracks[currentIndex];
    if (!audio || !Number.isFinite(audio.duration)) return;
    track.durationSeconds = Math.floor(audio.duration);
    track.duration = formatTime(audio.duration);
    if (seek) seek.max = String(track.durationSeconds);
    if (durationLabel) durationLabel.textContent = track.duration;
  });

  listen(audio, 'ended', () => {
    updatePlayState(false);
    if (config.autoAdvance) stepTrack(1, true);
  });

  loadTrack(currentIndex, false);

  return () => {
    controller.abort();
    audio?.pause();
    audio?.removeAttribute('src');
    dock.classList.remove('is-playing', 'is-expanded');
    if (panel) panel.hidden = true;
    delete dock.dataset.initialized;
  };
}
