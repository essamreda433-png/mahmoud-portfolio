const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lb-img');
const lbCapAr = document.getElementById('lb-cap-ar');
const lbCapEn = document.getElementById('lb-cap-en');
const lbCounter = document.getElementById('lb-counter');
const lbThumbs = document.getElementById('lb-thumbs');

let currentImageIndex = 0;
let images = [];

function openLightbox(element) {
  const parent = element.closest('.proj-card');
  const projNameAr = parent.querySelector('.proj-name-ar').innerText;
  const projNameEn = parent.querySelector('.proj-name-en').innerText;

  const imgSlots = Array.from(parent.querySelectorAll('.img-slot'));
  images = imgSlots.map(slot => ({
    src: slot.querySelector('img').src,
    altAr: slot.querySelector('.img-cap-ar') ? slot.querySelector('.img-cap-ar').innerText : '',
    altEn: slot.querySelector('.img-cap-en') ? slot.querySelector('.img-cap-en').innerText : '',
    projAr: projNameAr,
    projEn: projNameEn
  }));

  currentImageIndex = imgSlots.indexOf(element);
  if (currentImageIndex === -1) currentImageIndex = 0; // Fallback if element not found

  updateLightboxImage();
  updateThumbnails();
  lightbox.classList.add('open');
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lbThumbs.innerHTML = ''; // Clear thumbnails
}

function lbNav(direction) {
  currentImageIndex += direction;
  if (currentImageIndex < 0) {
    currentImageIndex = images.length - 1;
  } else if (currentImageIndex >= images.length) {
    currentImageIndex = 0;
  }
  updateLightboxImage();
  updateThumbnails();
}

function updateLightboxImage() {
  if (images.length === 0) return;
  const img = images[currentImageIndex];
  lbImg.src = img.src;
  lbCapAr.innerText = img.altAr || img.projAr;
  lbCapEn.innerText = img.altEn || img.projEn;
  lbCounter.innerText = `${currentImageIndex + 1} / ${images.length}`;
}

function updateThumbnails() {
  lbThumbs.innerHTML = '';
  images.forEach((img, index) => {
    const thumb = document.createElement('div');
    thumb.classList.add('lb-thumb');
    if (index === currentImageIndex) {
      thumb.classList.add('active');
    }
    thumb.onclick = () => {
      currentImageIndex = index;
      updateLightboxImage();
      updateThumbnails();
    };
    const thumbImg = document.createElement('img');
    thumbImg.src = img.src;
    thumbImg.alt = `Thumbnail ${index + 1}`;
    thumb.appendChild(thumbImg);
    lbThumbs.appendChild(thumb);
  });
  // Scroll active thumbnail into view
  const activeThumb = lbThumbs.querySelector('.lb-thumb.active');
  if (activeThumb) {
    activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) {
    closeLightbox();
  }
});

// Close lightbox on outside click
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target.id === 'lb-img-wrap') {
    closeLightbox();
  }
});

// Prevent image click from closing lightbox
lbImg.addEventListener('click', (e) => {
  e.stopPropagation();
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Highlight active section in sidebar
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.3 // Adjust as needed
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
    }
  });
}, observerOptions);

sections.forEach(section => {
  observer.observe(section);
});

// Initial active link set for the first section on load
window.addEventListener('load', () => {
  if (sections.length > 0 && navLinks.length > 0) {
    navLinks[0].classList.add('active');
  }
});

