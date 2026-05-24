type Cleanup = () => void;
type Season = 'spring' | 'summer' | 'autumn' | 'winter';
type Density = 'low' | 'medium' | 'high';

type SeasonalSettings = {
  season?: Season | 'auto';
  density?: Density;
  showOnMobile?: boolean;
  respectReducedMotion?: boolean;
  seasons?: Record<Season, boolean>;
};

const DEFAULT_ENABLED_SEASONS: Record<Season, boolean> = {
  spring: true,
  summer: true,
  autumn: true,
  winter: true,
};

function getAutoSeason(): Season {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'autumn';
  return 'winter';
}

function getParticleSize(season: Season) {
  if (season === 'summer') return 7 + Math.random() * 5;
  if (season === 'winter') return 3 + Math.random() * 4;
  if (season === 'autumn') return 7 + Math.random() * 7;
  return 7 + Math.random() * 6;
}

function getParticleDuration(season: Season) {
  return season === 'summer'
    ? 1.9 + Math.random() * 1.4
    : 11 + Math.random() * 9;
}

function parseSettings(root: HTMLElement): SeasonalSettings {
  try {
    return JSON.parse(root.dataset.settings || '{}') as SeasonalSettings;
  } catch {
    return {};
  }
}

function shouldRender(settings: SeasonalSettings, season: Season) {
  const enabledSeasons = settings.seasons ?? DEFAULT_ENABLED_SEASONS;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobileViewport = window.matchMedia('(max-width: 640px)').matches;

  return (
    enabledSeasons[season] !== false &&
    !(settings.respectReducedMotion && prefersReducedMotion) &&
    (settings.showOnMobile !== false || !mobileViewport)
  );
}

function getParticleCount(settings: SeasonalSettings) {
  const mobileViewport = window.matchMedia('(max-width: 640px)').matches;
  const densityCount: Record<Density, number> = {
    low: 5,
    medium: 10,
    high: 16,
  };
  const baseCount = densityCount[settings.density ?? 'medium'] ?? densityCount.medium;

  return mobileViewport ? Math.max(4, Math.round(baseCount * 0.45)) : baseCount;
}

function createParticle(season: Season) {
  const particle = document.createElement('span');
  const size = getParticleSize(season);

  particle.className = 'seasonal-particle';
  particle.style.setProperty('--x', `${Math.random() * 100}vw`);
  particle.style.setProperty('--size', `${size}px`);
  particle.style.setProperty('--drift', `${(Math.random() * 2 - 1) * 18}vw`);
  particle.style.setProperty('--rain-drift', `${(Math.random() * 2 - 1) * 3}vw`);
  particle.style.setProperty('--rotate', `${Math.random() * 360}deg`);
  particle.style.setProperty('--spin', `${(Math.random() > 0.5 ? 1 : -1) * (90 + Math.random() * 180)}deg`);
  particle.style.setProperty('--duration', `${getParticleDuration(season)}s`);
  particle.style.setProperty('--delay', `${Math.random() * -22}s`);
  particle.style.setProperty('--opacity', `${0.4 + Math.random() * 0.32}`);

  return particle;
}

export function initSeasonalEffects(): Cleanup | null {
  const root = document.querySelector<HTMLElement>('[data-seasonal-effects]');
  if (!root) return null;

  const settings = parseSettings(root);
  const season = settings.season && settings.season !== 'auto'
    ? settings.season
    : getAutoSeason();

  root.textContent = '';
  root.classList.remove('is-active');
  root.dataset.paused = document.hidden ? 'true' : 'false';
  root.dataset.season = season;

  if (!shouldRender(settings, season)) {
    delete root.dataset.particleCount;
    return () => {
      root.textContent = '';
      root.classList.remove('is-active');
    };
  }

  const count = getParticleCount(settings);
  const fragment = document.createDocumentFragment();

  root.dataset.particleCount = String(count);

  for (let index = 0; index < count; index += 1) {
    fragment.appendChild(createParticle(season));
  }

  root.appendChild(fragment);

  const frame = window.requestAnimationFrame(() => {
    root.classList.add('is-active');
  });

  const handleVisibilityChange = () => {
    root.dataset.paused = document.hidden ? 'true' : 'false';
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    window.cancelAnimationFrame(frame);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    root.textContent = '';
    root.classList.remove('is-active');
    delete root.dataset.particleCount;
  };
}
