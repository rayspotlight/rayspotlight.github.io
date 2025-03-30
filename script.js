document.querySelector('.menu-btn').addEventListener('click', function() {
const menu = document.querySelector('.mobile-menu');
menu.classList.toggle('show');
});

document.querySelector('#year').textContent = new Date().getFullYear();

function updateVideoPoster() {
const video = document.querySelector('.hero-video');
if (!video) return;
const mobilePoster = video.dataset.mobilePoster;
if (!mobilePoster) return;
    

if (window.innerWidth <= 768) {
video.poster = mobilePoster;
} else {
video.poster = video.getAttribute('poster');
}
}

updateVideoPoster();
window.addEventListener('resize', updateVideoPoster);

function initSlider() {
    let currentIndex = 0;
const slides = document.querySelector(".slides");
const slideItems = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

if (!slides || slideItems.length === 0) return;

function showSlide(index) {
if (index < 0) index = slideItems.length - 1;
if (index >= slideItems.length) index = 0;

slides.style.transform = `translateX(${-index * 100}%)`;

dots.forEach((dot, i) => {
dot.classList.toggle("active", i === index);
});

slideItems.forEach((slide, i) => {
slide.setAttribute("aria-hidden", i !== index);
});

currentIndex = index;
}

let autoSlideInterval = setInterval(() => showSlide(currentIndex + 1), 5000);

const sliderContainer = document.querySelector(".hero-slider");
if (sliderContainer) {
sliderContainer.addEventListener("mouseenter", () => clearInterval(autoSlideInterval));
sliderContainer.addEventListener("mouseleave", () => {
autoSlideInterval = setInterval(() => showSlide(currentIndex + 1), 5000);
});

let touchStartX = 0;
let touchEndX = 0;

sliderContainer.addEventListener("touchstart", (e) => {
touchStartX = e.touches[0].clientX;
});

sliderContainer.addEventListener("touchmove", (e) => {
touchEndX = e.touches[0].clientX;
});

sliderContainer.addEventListener("touchend", () => {
const diff = touchStartX - touchEndX;
if (diff > 50) showSlide(currentIndex + 1); 
else if (diff < -50) showSlide(currentIndex - 1); 
});
    }

dots.forEach((dot, i) => {
dot.addEventListener("click", () => showSlide(i));
});

showSlide(currentIndex);
}

document.addEventListener('DOMContentLoaded', initSlider);

const emailForm = document.querySelector('.email-form');
const emailInput = document.querySelector('.email-input');
const submitBtn = document.querySelector('.submit-btn');

const loadingOverlay = document.createElement('div');
loadingOverlay.className = 'fullscreen-overlay loading-overlay';
loadingOverlay.innerHTML = `
    <div class="pulse-animation"></div>
`;

const successOverlay = document.createElement('div');
successOverlay.className = 'fullscreen-overlay success-overlay';
successOverlay.innerHTML = `
<div class="overlay-content">
<img src="/assets/form-successful.svg" alt="Success">
<p>Thank you for subscribing!</p>
</div>
`;

const errorOverlay = document.createElement('div');
errorOverlay.className = 'fullscreen-overlay error-overlay';
errorOverlay.innerHTML = `
<div class="overlay-content">
<img src="/assets/failed.svg" alt="Error">
<p>Something went wrong. Please try again later.</p>
</div>
`;

document.body.appendChild(loadingOverlay);
document.body.appendChild(successOverlay);
document.body.appendChild(errorOverlay);

emailForm.addEventListener('submit', async function(e) {
e.preventDefault();
    
const email = emailInput.value.trim();
if (!validateEmail(email)) {
emailInput.style.borderColor = 'red';
showError("Please enter a valid email address");
return;
}
    
showOverlay(loadingOverlay);
submitBtn.disabled = true;
    
    try {
const formData = new FormData();
formData.append('email', email);
        
const response = await fetch('https://script.google.com/macros/s/AKfycbwnmmRZMTkN3DVVJyV4JWvtrqlP-9Z3b87djksy0NdgrFcDgoRdPg73E_dLnq4pdD2E/exec', {
method: 'POST',
body: formData
});
        
if (!response.ok) {
throw new Error('Network response was not ok');
}

const result = await response.json();
if (result.status === "success") {
showOverlay(successOverlay);
            
setTimeout(() => {
hideOverlay(successOverlay);
emailInput.value = '';
submitBtn.disabled = false;
}, 3000);
} else {
throw new Error(result.message || "Submission failed");
}
    } catch (error) {
showError(error.message || "Something went wrong. Please try again later.");
submitBtn.disabled = false;
} finally {
hideOverlay(loadingOverlay);
}
});

function validateEmail(email) {
const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return re.test(email);
}

function showOverlay(overlay) {
overlay.style.display = 'flex';
document.body.style.overflow = 'hidden';
}

function hideOverlay(overlay) {
overlay.style.display = 'none';
document.body.style.overflow = '';
}

function showError(message) {
errorOverlay.querySelector('p').textContent = message;
showOverlay(errorOverlay);
setTimeout(() => hideOverlay(errorOverlay), 3000);
}

emailInput.addEventListener('input', function() {
this.style.borderColor = '#ddd';
});

[loadingOverlay, successOverlay, errorOverlay].forEach(overlay => {
    overlay.addEventListener('click', function(e) {
if (e.target === this) {
hideOverlay(this);
if (this !== loadingOverlay) {
emailInput.value = '';
submitBtn.disabled = false;
}
}
});
});
