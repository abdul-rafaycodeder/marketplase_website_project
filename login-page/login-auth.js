
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAOoM5Mo0h0bkJHdRRT_DCEVIcqMlY7kzo",
    authDomain: "marketplase-project.firebaseapp.com",
    projectId: "marketplase-project",
    storageBucket: "marketplase-project.firebasestorage.app",
    messagingSenderId: "539266350649",
    appId: "1:539266350649:web:d32217bb184a7b6f00d7e8"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

//-------------------------------------------------------==> Signed up <== ------------------------------------------------//


const signUpbutton = document.getElementById('registerBtn');
signUpbutton.addEventListener('click', signUp)


function signUp() {

    const signupgmail = document.getElementById('signupEmail').value
    const signuppassword = document.getElementById('signupPassword').value

    // Email format regex
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (signupgmail === "" || signuppassword === "") {
        alert("Please fill all fields");

    }
    else if (!emailPattern.test(signupgmail)) {

        alert("Please enter a valid email address");

    }
    else if (signuppassword.length < 6) {

        alert("Password must be at least 6 characters");

    }
    else {

        createUserWithEmailAndPassword(auth, signupgmail, signuppassword)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;

                if (user) {
                    alert("Account created successfully");
                }
                console.log(user)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }
}

//-------------------------------------------------------==> Signed In <== ------------------------------------------------//


const loginbutton = document.getElementById('loginBtn');
loginbutton.addEventListener('click', signIn)


function signIn() {
    const signinemail = document.getElementById('signinEmail').value
    const signinpassword = document.getElementById('signinPassword').value


    signInWithEmailAndPassword(auth, signinemail, signinpassword)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
           console.log(user)
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorMessage)
        });
}