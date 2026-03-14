const togglePassword = document.getElementById("togglePassword");
const password = document.getElementById("password");

togglePassword.addEventListener("click", function () {

const type = password.getAttribute("type") === "password" ? "text" : "password";
password.setAttribute("type", type);

this.classList.toggle("fa-eye-slash");

});

//-----------------------------------------------login------------------------------------------//

 
  // // Import the functions you need from the SDKs you need
  // import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
  // // TODO: Add SDKs for Firebase products that you want to use
  // // https://firebase.google.com/docs/web/setup#available-libraries

  // // Your web app's Firebase configuration
  // const firebaseConfig = {
  //   apiKey: "AIzaSyAOoM5Mo0h0bkJHdRRT_DCEVIcqMlY7kzo",
  //   authDomain: "marketplase-project.firebaseapp.com",
  //   projectId: "marketplase-project",
  //   storageBucket: "marketplase-project.firebasestorage.app",
  //   messagingSenderId: "539266350649",
  //   appId: "1:539266350649:web:d32217bb184a7b6f00d7e8"
  // };

  // // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
 