const firstVisitLoader = document.querySelector('.site-loader');

function revealPage() {
  // A short task delay lets the initial motion styles paint, including in background tabs.
  window.setTimeout(() => {
    document.documentElement.classList.add('is-page-ready');
  }, 40);
}

if (document.documentElement.classList.contains('is-first-load') && firstVisitLoader) {
  const loaderStartedAt = performance.now();
  const minimumLoaderTime = 400;
  const maximumLoaderTime = 3000;

  const waitForImage = (image) => {
    if (image.complete) return Promise.resolve();

    return new Promise((resolve) => {
      image.addEventListener('load', resolve, { once: true });
      image.addEventListener('error', resolve, { once: true });
    });
  };

  const heroImages = [...document.querySelectorAll('.hero-art img, .hero-subject-plane img')];
  const imageReadiness = Promise.all(heroImages.map(waitForImage));
  const fontReadiness = document.fonts
    ? Promise.all([
        document.fonts.load('600 72px Manrope'),
        document.fonts.load('400 72px "Instrument Serif"'),
      ])
    : Promise.resolve();
  const criticalAssets = Promise.allSettled([imageReadiness, fontReadiness]);
  const timeout = new Promise((resolve) => window.setTimeout(resolve, maximumLoaderTime));

  Promise.race([criticalAssets, timeout]).then(() => {
    const remainingTime = Math.max(0, minimumLoaderTime - (performance.now() - loaderStartedAt));

    window.setTimeout(() => {
      firstVisitLoader.classList.add('is-leaving');
      revealPage();

      window.setTimeout(() => {
        document.documentElement.classList.remove('is-first-load');
        firstVisitLoader.remove();
      }, 320);
    }, remainingTime);
  });
} else {
  firstVisitLoader?.remove();
  revealPage();
}

const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks?.classList.toggle('open') ?? false;
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

navLinks?.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'Menu';
});

const hero = document.querySelector('.hero');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let heroFrame;

function updateHeroParallax() {
  heroFrame = undefined;
  if (!hero || reduceMotion.matches) return;

  const rect = hero.getBoundingClientRect();
  const progress = Math.max(0, Math.min(1, -rect.top / Math.max(rect.height, 1)));
  hero.style.setProperty('--hero-progress', progress.toFixed(3));
  hero.style.setProperty('--hero-bg-y', `${(progress * 24).toFixed(1)}px`);
  hero.style.setProperty('--hero-glow-y', `${(progress * 38).toFixed(1)}px`);
  hero.style.setProperty('--hero-subject-y', `${(progress * 62).toFixed(1)}px`);
}

function requestHeroParallax() {
  if (heroFrame === undefined) heroFrame = window.requestAnimationFrame(updateHeroParallax);
}

if (hero && !reduceMotion.matches) {
  updateHeroParallax();
  window.addEventListener('scroll', requestHeroParallax, { passive: true });
  window.addEventListener('resize', requestHeroParallax);
}

const revealGroups = [
  '.section-head > *',
  '.minds-grid > *',
  '.founder-principles > *',
  '.broker-copy',
  '.market-panel',
  '.purpose-head > *',
  '.arsenal-card',
  '.platforms-head > *',
  '.platform-card',
  '.giveaway-copy > *',
  '.entry-counter',
  '.social-head > *',
  '.social-card',
  '.cta-copy > *',
  '.footer-about > *',
  '.footer-links > *',
  '.copyright',
];

const revealElements = [...document.querySelectorAll(revealGroups.join(','))];

revealElements.forEach((element, index) => {
  const parent = element.parentElement;
  const siblingIndex = parent ? [...parent.children].indexOf(element) : 0;
  element.classList.add('scroll-reveal');
  element.style.setProperty('--reveal-delay', `${Math.min(siblingIndex, 5) * 70}ms`);

  if (index % 3 === 1) element.classList.add('reveal-soft');
});

document.documentElement.classList.add('motion-ready');

if (reduceMotion.matches || !('IntersectionObserver' in window)) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8%', threshold: 0.12 },
  );

  revealElements.forEach((element) => revealObserver.observe(element));
}

const sections = [...document.querySelectorAll('main section[id]')];
const navAnchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navAnchors.forEach((anchor) => {
        anchor.classList.toggle('active', anchor.getAttribute('href') === `#${visible.target.id}`);
      });
    },
    { rootMargin: '-20% 0px -65%', threshold: [0, 0.2, 0.6] },
  );

  sections.forEach((section) => sectionObserver.observe(section));
}

const serviceModal = document.querySelector('.service-modal');
const serviceModalClose = serviceModal?.querySelector('.service-modal-close');
const serviceModalImage = serviceModal?.querySelector('.service-modal-visual img');
const serviceModalLabel = serviceModal?.querySelector('.service-modal-label');
const serviceModalTitle = serviceModal?.querySelector('#service-modal-title');
const serviceModalList = serviceModal?.querySelector('.service-modal-list');
const serviceModalCta = serviceModal?.querySelector('.service-modal-cta');
const serviceModalCtaLabel = serviceModalCta?.querySelector('span');
let serviceModalTrigger;

document.querySelectorAll('.service-details-button').forEach((button) => {
  button.addEventListener('click', () => {
    const card = button.closest('.arsenal-card');
    const image = card?.querySelector('.service-visual img');
    const label = card?.querySelector('.card-label');
    const title = card?.querySelector('h3');
    const list = card?.querySelector('ul');
    const primaryAction = card?.querySelector('.service-primary');

    if (!serviceModal || !image || !label || !title || !list || !primaryAction) return;

    if (serviceModalImage) {
      serviceModalImage.src = image.src;
      serviceModalImage.alt = image.alt;
    }
    if (serviceModalLabel) serviceModalLabel.textContent = label.textContent;
    if (serviceModalTitle) serviceModalTitle.textContent = title.textContent;
    if (serviceModalList) serviceModalList.innerHTML = list.innerHTML;
    if (serviceModalCta) serviceModalCta.href = primaryAction.href;
    if (serviceModalCtaLabel) serviceModalCtaLabel.textContent = primaryAction.textContent.trim();

    serviceModalTrigger = button;
    document.body.classList.add('modal-open');
    serviceModal.showModal();
  });
});

serviceModalClose?.addEventListener('click', () => serviceModal?.close());

serviceModal?.addEventListener('click', (event) => {
  if (event.target === serviceModal) serviceModal.close();
});

serviceModal?.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  serviceModalTrigger?.focus();
});

serviceModalCta?.addEventListener('click', () => serviceModal?.close());
