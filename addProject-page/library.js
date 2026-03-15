import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {

    apiKey: "AIzaSyAOoM5Mo0h0bkJHdRRT_DCEVIcqMlY7kzo",
    authDomain: "marketplase-project.firebaseapp.com",
    databaseURL: "https://marketplase-project-default-rtdb.firebaseio.com",
    projectId: "marketplase-project",
    storageBucket: "marketplase-project.firebasestorage.app",
    messagingSenderId: "539266350649",
    appId: "1:539266350649:web:d32217bb184a7b6f00d7e8"

};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const cardRef = ref(db, "cards");

onValue(cardRef, (snapshot) => {

    let container = document.getElementById("libraryCards");

    container.innerHTML = "";

    snapshot.forEach((data) => {

        let card = data.val();

        container.innerHTML += `

<div class="card">

<img src="${card.image}">
<h3>${card.name}</h3>
<h4>${card.title}</h4>
<p>${card.desc}</p>

</div>

`;

    });

});