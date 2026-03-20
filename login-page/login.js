// Initialize AOS
AOS.init({
    duration: 800,
    once: true
});

// DOM Elements
const signInBtn = document.getElementById("signInBtn");
const signUpBtn = document.getElementById("signUpBtn");
const signInForm = document.getElementById("signInForm");
const signUpForm = document.getElementById("signUpForm");
const switchToSignUp = document.getElementById("switchToSignUp");
const switchToSignIn = document.getElementById("switchToSignIn");
const authFooterText = document.getElementById("authFooterText");
const formTitle = document.getElementById("formTitle");
const formSubtitle = document.getElementById("formSubtitle");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

// Tab Switching
signInBtn.addEventListener("click", () => {
    switchToSignInForm();
});

signUpBtn.addEventListener("click", () => {
    switchToSignUpForm();
});

// Switch links
if (switchToSignUp) {
    switchToSignUp.addEventListener("click", (e) => {
        e.preventDefault();
        switchToSignUpForm();
    });
}

// Create switch to sign in link dynamically
function updateFooterLink() {
    const footerText = document.querySelector('.auth-footer p');
    if (footerText) {
        const isSignIn = signInForm.classList.contains('active');
        footerText.innerHTML = isSignIn ? 
            'Don\'t have an account? <a href="#" id="switchToSignUp">Sign up</a>' : 
            'Already have an account? <a href="#" id="switchToSignIn">Sign in</a>';
        
        // Re-attach event listeners
        document.getElementById('switchToSignUp')?.addEventListener('click', (e) => {
            e.preventDefault();
            switchToSignUpForm();
        });
        
        document.getElementById('switchToSignIn')?.addEventListener('click', (e) => {
            e.preventDefault();
            switchToSignInForm();
        });
    }
}

function switchToSignInForm() {
    signInForm.classList.add("active");
    signUpForm.classList.remove("active");
    signInBtn.classList.add("active");
    signUpBtn.classList.remove("active");
    formTitle.textContent = "Sign In";
    formSubtitle.textContent = "Welcome back! Please enter your details";
    updateFooterLink();
    
    // Clear any error states
    clearErrors();
}

function switchToSignUpForm() {
    signUpForm.classList.add("active");
    signInForm.classList.remove("active");
    signUpBtn.classList.add("active");
    signInBtn.classList.remove("active");
    formTitle.textContent = "Create Account";
    formSubtitle.textContent = "Join us today! Enter your details below";
    updateFooterLink();
    
    // Clear any error states
    clearErrors();
}

// Password Toggle
window.togglePassword = function(id) {
    const passwordInput = document.getElementById(id);
    const icon = event.currentTarget.querySelector('i');
    
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = "password";
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Password Strength Indicator
const signupPassword = document.getElementById('signupPassword');
if (signupPassword) {
    signupPassword.addEventListener('input', checkPasswordStrength);
}

function checkPasswordStrength() {
    const password = signupPassword.value;
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthText = document.getElementById('strengthText');
    
    let strength = 0;
    
    // Check length
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    
    // Check for numbers
    if (/\d/.test(password)) strength++;
    
    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    
    // Check for uppercase
    if (/[A-Z]/.test(password)) strength++;
    
    // Reset bars
    strengthBars.forEach(bar => bar.classList.remove('active'));
    
    // Set bars based on strength (max 4)
    const barCount = Math.min(strength, 4);
    for (let i = 0; i < barCount; i++) {
        strengthBars[i].classList.add('active');
    }
    
    // Set text
    if (password.length === 0) {
        strengthText.textContent = 'Enter a password';
        strengthText.style.color = 'var(--gray)';
    } else if (strength < 2) {
        strengthText.textContent = 'Weak password';
        strengthText.style.color = 'var(--danger)';
    } else if (strength < 4) {
        strengthText.textContent = 'Medium password';
        strengthText.style.color = 'var(--warning)';
    } else {
        strengthText.textContent = 'Strong password';
        strengthText.style.color = 'var(--secondary)';
    }
}

// Real-time Validation
const signinEmail = document.getElementById('signinEmail');
const signinPassword = document.getElementById('signinPassword');
const signupName = document.getElementById('signupName');
const signupEmail = document.getElementById('signupEmail');

if (signinEmail) {
    signinEmail.addEventListener('input', () => validateEmail(signinEmail, 'signinEmailFeedback'));
}

if (signinPassword) {
    signinPassword.addEventListener('input', () => validatePassword(signinPassword, 'signinPasswordFeedback'));
}

if (signupName) {
    signupName.addEventListener('input', () => validateName(signupName, 'signupNameFeedback'));
}

if (signupEmail) {
    signupEmail.addEventListener('input', () => validateEmail(signupEmail, 'signupEmailFeedback'));
}

function validateName(input, feedbackId) {
    const feedback = document.getElementById(feedbackId);
    const value = input.value.trim();
    
    if (value.length === 0) {
        showError(input, feedback, 'Name is required');
        return false;
    } else if (value.length < 2) {
        showError(input, feedback, 'Name must be at least 2 characters');
        return false;
    } else {
        showSuccess(input, feedback);
        return true;
    }
}

function validateEmail(input, feedbackId) {
    const feedback = document.getElementById(feedbackId);
    const value = input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value.length === 0) {
        showError(input, feedback, 'Email is required');
        return false;
    } else if (!emailPattern.test(value)) {
        showError(input, feedback, 'Please enter a valid email address');
        return false;
    } else {
        showSuccess(input, feedback);
        return true;
    }
}

function validatePassword(input, feedbackId) {
    const feedback = document.getElementById(feedbackId);
    const value = input.value;
    
    if (value.length === 0) {
        showError(input, feedback, 'Password is required');
        return false;
    } else if (value.length < 6) {
        showError(input, feedback, 'Password must be at least 6 characters');
        return false;
    } else {
        showSuccess(input, feedback);
        return true;
    }
}

function showError(input, feedback, message) {
    input.classList.add('error');
    input.classList.remove('success');
    if (feedback) {
        feedback.textContent = message;
    }
}

function showSuccess(input, feedback) {
    input.classList.remove('error');
    input.classList.add('success');
    if (feedback) {
        feedback.textContent = '';
    }
}

function clearErrors() {
    document.querySelectorAll('.input-group input').forEach(input => {
        input.classList.remove('error', 'success');
    });
    
    document.querySelectorAll('.input-feedback').forEach(feedback => {
        feedback.textContent = '';
    });
}

// Toast Notification
window.showToast = function(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = 'toast ' + (type === 'error' ? 'error' : '');
    
    const icon = toast.querySelector('i');
    if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
    } else {
        icon.className = 'fas fa-check-circle';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Loading State
window.showLoading = function(buttonId, show) {
    const button = document.getElementById(buttonId);
    if (button) {
        if (show) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }
}

// Initialize sign in as active
switchToSignInForm();