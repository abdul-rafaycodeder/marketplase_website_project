import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider,
    onAuthStateChanged,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOoM5Mo0h0bkJHdRRT_DCEVIcqMlY7kzo",
    authDomain: "marketplase-project.firebaseapp.com",
    projectId: "marketplase-project",
    storageBucket: "marketplase-project.firebasestorage.app",
    messagingSenderId: "539266350649",
    appId: "1:539266350649:web:d32217bb184a7b6f00d7e8",
    databaseURL: "https://marketplase-project-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

// Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Add scopes for GitHub
githubProvider.addScope('user:email');

// Auth State Observer
onAuthStateChanged(auth, async (user) => {
    if (user) {
        console.log("User Logged In:", user.email);

        // Check if user exists in database, if not, create record
        const userRef = ref(database, "users/" + user.uid);
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
            // New user from social login, save to database
            await set(userRef, {
                name: user.displayName || user.email.split('@')[0],
                email: user.email,
                photoURL: user.photoURL || '',
                provider: user.providerData[0]?.providerId || 'email',
                createdAt: Date.now(),
                lastLogin: Date.now()
            });
        } else {
            // Update last login
            await set(ref(database, "users/" + user.uid + "/lastLogin"), Date.now());
        }

        // You can redirect to dashboard here if needed
        // window.location.href = "dashboard.html";
    } else {
        console.log("User Logged Out");
    }
});

// SIGN UP FUNCTION
const registerBtn = document.getElementById('registerBtn');
if (registerBtn) {
    registerBtn.addEventListener('click', signUp);
}

async function signUp() {
    showLoading('registerBtn', true);

    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const termsAgree = document.getElementById('termsAgree')?.checked;

    if (!name || !email || !password) {
        showToast('Please fill all fields', 'error');
        showLoading('registerBtn', false);
        return;
    }

    if (!termsAgree) {
        showToast('Please agree to Terms of Service', 'error');
        showLoading('registerBtn', false);
        return;
    }



    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address', 'error');
        showLoading('registerBtn', false);
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        showLoading('registerBtn', false);
        return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;


        if (user) {
            location.href = "../addProject-page/addProject.html"
        }

        await set(ref(database, "users/" + user.uid), {
            name: name,
            email: email,
            provider: 'email',
            createdAt: Date.now(),
            lastLogin: Date.now()
        });

        showToast('Account created successfully!', 'success');

        document.getElementById('signupName').value = '';
        document.getElementById('signupEmail').value = '';
        document.getElementById('signupPassword').value = '';
        if (termsAgree) document.getElementById('termsAgree').checked = false;

        setTimeout(() => {
            switchToSignInForm();
        }, 2000);

    } catch (error) {
        console.error('Signup error:', error);

        switch (error.code) {
            case 'auth/email-already-in-use':
                showToast('Email is already registered', 'error');
                break;
            case 'auth/invalid-email':
                showToast('Invalid email address', 'error');
                break;
            case 'auth/weak-password':
                showToast('Password is too weak', 'error');
                break;
            default:
                showToast('Signup failed: ' + error.message, 'error');
        }
    } finally {
        showLoading('registerBtn', false);
    }
}

// SIGN IN FUNCTION
const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', signIn);
}

async function signIn() {
    showLoading('loginBtn', true);

    const email = document.getElementById('signinEmail').value.trim();
    const password = document.getElementById('signinPassword').value;
    const rememberMe = document.getElementById('rememberMe')?.checked;

    if (!email || !password) {
        showToast('Please fill all fields', 'error');
        showLoading('loginBtn', false);
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showToast('Please enter a valid email address', 'error');
        showLoading('loginBtn', false);
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (user) {
            location.href = "../addProject-page/addProject.html"
        }

        await set(ref(database, "users/" + user.uid + "/lastLogin"), Date.now());

        showToast('Login successful! Redirecting...', 'success');

        document.getElementById('signinEmail').value = '';
        document.getElementById('signinPassword').value = '';

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);

        switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                showToast('Invalid email or password', 'error');
                break;
            case 'auth/too-many-requests':
                showToast('Too many failed attempts. Please try again later', 'error');
                break;
            case 'auth/network-request-failed':
                showToast('Network error. Check your internet connection', 'error');
                break;
            case 'auth/user-disabled':
                showToast('This account has been disabled', 'error');
                break;
            default:
                showToast('Login failed: ' + error.message, 'error');
        }
    } finally {
        showLoading('loginBtn', false);
    }
}

// GOOGLE SIGN-IN FUNCTION
async function signInWithGoogle() {
    showToast('Connecting to Google...', 'info');

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // The signed-in user info
        console.log('Google sign-in successful:', user);

        showToast('Google sign-in successful! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {
        console.error('Google sign-in error:', error);

        // Handle errors
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                showToast('Sign-in popup was closed', 'error');
                break;
            case 'auth/popup-blocked':
                showToast('Pop-up blocked by browser', 'error');
                break;
            case 'auth/cancelled-popup-request':
                showToast('Sign-in cancelled', 'error');
                break;
            case 'auth/account-exists-with-different-credential':
                showToast('An account already exists with the same email address', 'error');
                break;
            default:
                showToast('Google sign-in failed: ' + error.message, 'error');
        }
    }
}

// GITHUB SIGN-IN FUNCTION
async function signInWithGithub() {
    showToast('Connecting to GitHub...', 'info');

    try {
        const result = await signInWithPopup(auth, githubProvider);
        const user = result.user;

        // The signed-in user info
        console.log('GitHub sign-in successful:', user);

        showToast('GitHub sign-in successful! Redirecting...', 'success');

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);

    } catch (error) {
        console.error('GitHub sign-in error:', error);

        // Handle errors
        switch (error.code) {
            case 'auth/popup-closed-by-user':
                showToast('Sign-in popup was closed', 'error');
                break;
            case 'auth/popup-blocked':
                showToast('Pop-up blocked by browser', 'error');
                break;
            case 'auth/cancelled-popup-request':
                showToast('Sign-in cancelled', 'error');
                break;
            case 'auth/account-exists-with-different-credential':
                showToast('An account already exists with the same email address', 'error');
                break;
            default:
                showToast('GitHub sign-in failed: ' + error.message, 'error');
        }
    }
}

// Forgot Password Function
async function resetPassword(email) {
    if (!email) {
        showToast('Please enter your email address', 'error');
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showToast('Password reset email sent! Check your inbox', 'success');
    } catch (error) {
        console.error('Password reset error:', error);

        switch (error.code) {
            case 'auth/user-not-found':
                showToast('No account found with this email', 'error');
                break;
            case 'auth/invalid-email':
                showToast('Invalid email address', 'error');
                break;
            default:
                showToast('Error sending reset email: ' + error.message, 'error');
        }
    }
}

// Add event listeners for social buttons
document.querySelector('.social-btn.google')?.addEventListener('click', signInWithGoogle);
document.querySelector('.social-btn.github')?.addEventListener('click', signInWithGithub);

// Forgot password link
document.querySelector('.forgot-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('signinEmail')?.value;
    resetPassword(email);
});