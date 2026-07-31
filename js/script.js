// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Enquiry form -> WhatsApp
const WHATSAPP_NUMBER = '918857009635'; // update if the number ever changes
const enquiryForm = document.getElementById('enquiryForm');

enquiryForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('enqName').value.trim();
  const phone = document.getElementById('enqPhone').value.trim();
  const sharing = document.getElementById('enqSharing').value;
  const gender = document.getElementById('enqGender').value;

  const message =
    `Hi, I'm ${name} (${phone}). I'm interested in a ${sharing} room ` +
    `(${gender}) at Chhatrapati PG.`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener');
});

// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Scroll reveal
const revealTargets = document.querySelectorAll(
  '.tariff, .amenities .section-head, .amenity, .gallery__item, .location__text, .contact__inner'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));
