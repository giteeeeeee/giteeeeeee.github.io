type Cleanup = () => void;

type GalleryPhoto = {
  id: string;
  image: string;
  gradient?: string;
  imageAlt?: string;
  title: string;
  caption?: string;
  signature?: string;
  fileName?: string;
  downloadName?: string;
  downloadUrl?: string;
  date: string;
  location: string;
  camera: string;
  tags: string[];
};

export function initGalleryLightbox(): Cleanup | null {
  const lightbox = document.getElementById('gallery-lightbox');
  const config = document.querySelector<HTMLScriptElement>('[data-gallery-lightbox-config]');
  if (!lightbox || lightbox.dataset.initialized === 'true' || !config?.textContent) return null;

  let photos: GalleryPhoto[];
  try {
    photos = JSON.parse(config.textContent) as GalleryPhoto[];
  } catch (error) {
    console.error('[Gallery] Invalid lightbox configuration.', error);
    return null;
  }
  if (!photos.length) return null;

  lightbox.dataset.initialized = 'true';
  const controller = new AbortController();
  const { signal } = controller;
  const image = lightbox.querySelector<HTMLImageElement>('[data-lightbox-image]');
  const fallback = lightbox.querySelector<HTMLElement>('[data-lightbox-fallback]');
  const title = lightbox.querySelector<HTMLElement>('[data-lightbox-title]');
  const caption = lightbox.querySelector<HTMLElement>('[data-lightbox-caption]');
  const signature = lightbox.querySelector<HTMLElement>('[data-lightbox-signature]');
  const file = lightbox.querySelector<HTMLElement>('[data-lightbox-file]');
  const date = lightbox.querySelector<HTMLElement>('[data-lightbox-date]');
  const location = lightbox.querySelector<HTMLElement>('[data-lightbox-location]');
  const camera = lightbox.querySelector<HTMLElement>('[data-lightbox-camera]');
  const tags = lightbox.querySelector<HTMLElement>('[data-lightbox-tags]');
  const download = lightbox.querySelector<HTMLAnchorElement>('[data-lightbox-download]');
  const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-photo-id]'));
  const closeButton = lightbox.querySelector<HTMLButtonElement>('[data-lightbox-close]');
  let currentIndex = 0;
  let trigger: HTMLElement | null = null;

  const renderPhoto = (photo: GalleryPhoto) => {
    if (!image || !title || !caption || !signature || !file || !date || !location || !camera || !tags || !download) return;
    const hasImage = Boolean(photo.image);
    image.hidden = !hasImage;

    if (fallback) {
      fallback.hidden = hasImage;
      fallback.style.setProperty('--fallback-bg', photo.gradient || 'linear-gradient(135deg, #46646d, #6d556f)');
    }

    if (hasImage) {
      image.src = photo.image;
    } else {
      image.removeAttribute('src');
    }
    image.alt = photo.imageAlt || photo.title;
    title.textContent = photo.title;
    caption.textContent = photo.caption || '';
    signature.textContent = photo.signature || '';
    signature.hidden = !photo.signature;
    file.textContent = photo.fileName || photo.downloadName || '';
    date.textContent = photo.date;
    location.textContent = photo.location;
    camera.textContent = photo.camera;
    tags.replaceChildren(...photo.tags.map((tag) => {
      const element = document.createElement('span');
      element.textContent = tag;
      return element;
    }));

    if (photo.downloadUrl) {
      download.href = photo.downloadUrl;
      download.setAttribute('download', photo.downloadName || photo.fileName || '');
      download.hidden = false;
    } else {
      download.hidden = true;
    }
  };

  const closePhoto = (restoreFocus = true) => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    image?.removeAttribute('src');
    if (restoreFocus) trigger?.focus();
    trigger = null;
  };

  const openPhoto = (photoId?: string, source?: HTMLElement) => {
    const nextIndex = photos.findIndex((photo) => photo.id === photoId);
    currentIndex = Math.max(0, nextIndex);
    trigger = source ?? null;
    renderPhoto(photos[currentIndex]);
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    closeButton?.focus();
  };

  const stepPhoto = (direction: number) => {
    currentIndex = (currentIndex + direction + photos.length) % photos.length;
    renderPhoto(photos[currentIndex]);
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => openPhoto(card.dataset.photoId, card), { signal });
  });
  closeButton?.addEventListener('click', () => closePhoto(), { signal });
  lightbox.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => stepPhoto(-1), { signal });
  lightbox.querySelector('[data-lightbox-next]')?.addEventListener('click', () => stepPhoto(1), { signal });
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closePhoto();
  }, { signal });
  window.addEventListener('keydown', (event) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (event.key === 'Escape') closePhoto();
    if (event.key === 'ArrowLeft') stepPhoto(-1);
    if (event.key === 'ArrowRight') stepPhoto(1);
  }, { signal });

  return () => {
    controller.abort();
    closePhoto(false);
    delete lightbox.dataset.initialized;
  };
}
