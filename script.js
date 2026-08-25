const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

navLinks?.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
  if (menuButton) menuButton.textContent = 'Menu';
});

const contactDialog = document.querySelector('.contact-dialog');
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

document.querySelectorAll('[data-open-contact]').forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    contactDialog?.showModal();
    document.body.classList.add('modal-open');
    contactDialog?.querySelector('input')?.focus();
  });
});

document.querySelector('.dialog-close')?.addEventListener('click', () => {
  contactDialog?.close();
});

contactDialog?.addEventListener('click', (event) => {
  if (event.target === contactDialog) contactDialog.close();
});

contactDialog?.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
});

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get('name') || 'there').trim();
  formStatus.textContent = `Thanks, ${name}. Your project brief is ready to send.`;
  contactForm.querySelector('button[type="submit"]').textContent = 'Inquiry received ✓';

  window.setTimeout(() => {
    contactDialog?.close();
    contactForm.reset();
    formStatus.textContent = '';
    contactForm.querySelector('button[type="submit"]').innerHTML = 'Send inquiry <b>→</b>';
  }, 1400);
});

const testimonials = [
  {
    copy: 'The process felt clear and collaborative from start to finish. Fluxora understood our goals and turned them into an experience our customers genuinely enjoy.',
    name: 'Amelia N.',
    role: 'Founder, Northline',
    image: 'assets/client-amelia.png',
  },
  {
    copy: 'Fluxora brought focus to a complicated product. Every decision had a reason, and our team felt involved throughout the entire process.',
    name: 'Marcus T.',
    role: 'Product Director, Lattice',
    image: 'assets/studio-team.png',
  },
  {
    copy: 'The new experience feels unmistakably like us—only clearer, faster, and more useful. That balance is difficult to find in a creative partner.',
    name: 'Sofia R.',
    role: 'Co-founder, Aster Labs',
    image: 'assets/team-portrait.png',
  },
];

const testimonialCard = document.querySelector('.testimonial-wrap article');
const reviewPhoto = document.querySelector('.review-photo');
const reviewCopy = document.querySelector('[data-review-copy]');
const reviewName = document.querySelector('[data-review-name]');
const reviewRole = document.querySelector('[data-review-role]');
const reviewIndex = document.querySelector('[data-review-index]');
const reviewDots = [...document.querySelectorAll('.testimonial-dots button')];
let activeTestimonial = 0;
let testimonialTimer;

function showTestimonial(index) {
  activeTestimonial = (index + testimonials.length) % testimonials.length;
  const testimonial = testimonials[activeTestimonial];
  testimonialCard?.classList.add('changing');

  window.setTimeout(() => {
    if (reviewPhoto) reviewPhoto.style.backgroundImage = `url("${testimonial.image}")`;
    if (reviewCopy) reviewCopy.textContent = testimonial.copy;
    if (reviewName) reviewName.textContent = testimonial.name;
    if (reviewRole) reviewRole.textContent = testimonial.role;
    if (reviewIndex) reviewIndex.textContent = String(activeTestimonial + 1).padStart(2, '0');
    reviewDots.forEach((dot, dotIndex) => dot.classList.toggle('active', dotIndex === activeTestimonial));
    testimonialCard?.classList.remove('changing');
  }, 160);
}

function startTestimonialTimer() {
  window.clearInterval(testimonialTimer);
  testimonialTimer = window.setInterval(() => showTestimonial(activeTestimonial + 1), 6500);
}

document.querySelector('.testimonial-prev')?.addEventListener('click', () => {
  showTestimonial(activeTestimonial - 1);
  startTestimonialTimer();
});

document.querySelector('.testimonial-next')?.addEventListener('click', () => {
  showTestimonial(activeTestimonial + 1);
  startTestimonialTimer();
});

reviewDots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showTestimonial(index);
    startTestimonialTimer();
  });
});

testimonialCard?.addEventListener('pointerenter', () => window.clearInterval(testimonialTimer));
testimonialCard?.addEventListener('pointerleave', startTestimonialTimer);
testimonialCard?.addEventListener('focusin', () => window.clearInterval(testimonialTimer));
testimonialCard?.addEventListener('focusout', startTestimonialTimer);

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  startTestimonialTimer();
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
