// Mobile menu toggle
document.querySelector('.menu-btn').addEventListener('click', function() {
    const menu = document.querySelector('.mobile-menu');
    menu.classList.toggle('show');
});

// Update copyright year
document.querySelector('#year').textContent = new Date().getFullYear();

// Responsive video poster
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

// Initialize and handle window resize
updateVideoPoster();
window.addEventListener('resize', updateVideoPoster);

// Email Form Handling
const emailForm = document.querySelector('.email-form');
const emailInput = document.querySelector('.email-input');
const submitBtn = document.querySelector('.submit-btn');

// Create full-screen overlay elements
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

// Add overlays to body
document.body.appendChild(loadingOverlay);
document.body.appendChild(successOverlay);
document.body.appendChild(errorOverlay);

// Form submission handler
emailForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Validate email
    const email = emailInput.value.trim();
    if (!validateEmail(email)) {
        emailInput.style.borderColor = 'red';
        showError("Please enter a valid email address");
        return;
    }
    
    // Show loading state
    showOverlay(loadingOverlay);
    submitBtn.disabled = true;
    
    try {
        // Prepare form data (using FormData as in working contact form)
        const formData = new FormData();
        formData.append('email', email);
        
        // Submit to Google Apps Script (using same pattern as working form)
        const response = await fetch('https://script.google.com/macros/s/AKfycbwnmmRZMTkN3DVVJyV4JWvtrqlP-9Z3b87djksy0NdgrFcDgoRdPg73E_dLnq4pdD2E/exec', {
            method: 'POST',
            body: formData
        });
        
        // Check response (matching your working form's approach)
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        
        if (result.status === "success") {
            // Show success
            showOverlay(successOverlay);
            
            // Reset after 3 seconds
            setTimeout(() => {
                hideOverlay(successOverlay);
                emailInput.value = '';
                submitBtn.disabled = false;
            }, 3000);
        } else {
            throw new Error(result.message || "Submission failed");
        }
    } catch (error) {
        // Show error with specific message
        showError(error.message || "Something went wrong. Please try again later.");
        submitBtn.disabled = false;
    } finally {
        hideOverlay(loadingOverlay);
    }
});

// Helper functions
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

// Clear error state when typing
emailInput.addEventListener('input', function() {
    this.style.borderColor = '#ddd';
});

// Close overlays when clicking outside content
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