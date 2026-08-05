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
  '.tariff .section-head, .room-card, .rate-card, .amenities .section-head, .amenity, .gallery__item, .location__text, .contact__inner'
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

// Gallery lightbox
const galleryItems = Array.from(document.querySelectorAll('.gallery__item'));
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxCaption = document.getElementById('lightboxCaption');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let lightboxIndex = 0;
let lastFocusedElement = null;

function showLightboxImage(index) {
  const total = galleryItems.length;
  lightboxIndex = (index + total) % total;
  const item = galleryItems[lightboxIndex];
  const img = item.querySelector('img');
  const caption = item.querySelector('span');
  lightboxImage.src = img.src;
  lightboxImage.alt = img.alt || '';
  lightboxCaption.textContent = caption ? caption.textContent : '';
}

function openLightbox(index) {
  lastFocusedElement = document.activeElement;
  showLightboxImage(index);
  lightbox.hidden = false;
  document.body.style.overflow = 'hidden';
  lightboxClose?.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = '';
  lastFocusedElement?.focus();
}

galleryItems.forEach((item, index) => {
  item.addEventListener('click', () => openLightbox(index));
});

lightboxClose?.addEventListener('click', closeLightbox);
lightboxPrev?.addEventListener('click', () => showLightboxImage(lightboxIndex - 1));
lightboxNext?.addEventListener('click', () => showLightboxImage(lightboxIndex + 1));

// Click on the dark backdrop (not the image/figure/buttons) closes it
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (lightbox.hidden) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showLightboxImage(lightboxIndex - 1);
  if (e.key === 'ArrowRight') showLightboxImage(lightboxIndex + 1);
});

// Touch swipe support (left/right) for mobile — the primary device for
// most visitors. Passive listeners, no scroll-blocking on vertical swipes.
let touchStartX = 0;
let touchStartY = 0;

lightbox?.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, { passive: true });

lightbox?.addEventListener('touchend', (e) => {
  const deltaX = e.changedTouches[0].clientX - touchStartX;
  const deltaY = e.changedTouches[0].clientY - touchStartY;
  const SWIPE_THRESHOLD = 40;

  // Only treat as a swipe if horizontal movement clearly dominates —
  // avoids hijacking a vertical scroll/drag gesture.
  if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
    if (deltaX > 0) {
      showLightboxImage(lightboxIndex - 1);
    } else {
      showLightboxImage(lightboxIndex + 1);
    }
  }
}, { passive: true });
