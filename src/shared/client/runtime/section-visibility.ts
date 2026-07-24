type Cleanup = () => void;

export function initSectionVisibility(): Cleanup | null {
  const container = document.querySelector<HTMLElement>('#fullpage-container[data-home-layout="flow"]');
  if (!container) return null;

  const sections = Array.from(container.querySelectorAll<HTMLElement>('.fullpage-section'));
  if (!sections.length) return null;

  const setVisible = (section: HTMLElement, visible: boolean) => {
    section.dataset.inViewport = visible ? 'true' : 'false';
  };

  if (!('IntersectionObserver' in window)) {
    sections.forEach((section) => setVisible(section, true));
    return () => sections.forEach((section) => delete section.dataset.inViewport);
  }

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    setVisible(section, rect.bottom >= -160 && rect.top <= window.innerHeight + 160);
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => setVisible(entry.target as HTMLElement, entry.isIntersecting));
  }, {
    rootMargin: '160px 0px',
    threshold: 0.01,
  });

  sections.forEach((section) => observer.observe(section));

  return () => {
    observer.disconnect();
    sections.forEach((section) => delete section.dataset.inViewport);
  };
}
