import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
    getDatabase,
    ref,
    push,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


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

//--------------------------------------------------==> Create Card <==------------------------------------------------//

function createCard() {

    let name = document.getElementById("name").value;
    let title = document.getElementById("title").value;
    let image = document.getElementById("image").value;
    let desc = document.getElementById("desc").value;

    if (name === "" || title === "" || image === "" || desc === "") {
        alert("Please fill all fields");
        return;
    }

    push(cardRef, {
        name: name,
        title: title,
        image: image,
        desc: desc
    });

    alert("Card Created Successfully");

}

window.createCard = createCard;


//--------------------------------------------------==> Realtime Card Load (Refresh ke baad bhi rahega) <==------------------------------------------------//


onValue(cardRef, (snapshot) => {

    let container = document.getElementById("cardContainer");

    container.innerHTML = "";

    snapshot.forEach((data) => {

        let card = data.val();
        let key = data.key;

        container.innerHTML += `

<div class="card">

<img src="${card.image}">

<div class="card-content">

<h3>${card.name}</h3>
<h4>${card.title}</h4>
<p>${card.desc}</p>

<button onclick="editCard('${key}')">Edit</button>
<button onclick="deleteCard('${key}')">Delete</button>

</div>

</div>

`;

    });

});


//--------------------------------------------------==> Delete Card (Confirm Popup) <==------------------------------------------------//

window.deleteCard = function (key) {

    let confirmDelete = confirm("Are you sure you want to delete this card?");

    if (confirmDelete) {

        remove(ref(db, "cards/" + key));

        alert("Card Deleted");

    }

}


//--------------------------------------------------==> Edit Card Popup <==------------------------------------------------//

let currentKey = "";

window.editCard = function (key) {

    currentKey = key;

    document.getElementById("editPopup").style.display = "flex";

}

window.closePopup = function () {

    document.getElementById("editPopup").style.display = "none";

}

//--------------------------------------------------==> Update Card <==------------------------------------------------//

window.updateCard=function(){

let name=document.getElementById("editName").value;
let title=document.getElementById("editTitle").value;
let image=document.getElementById("editImage").value;
let desc=document.getElementById("editDesc").value;

update(ref(db,"cards/"+currentKey),{

name:name,
title:title,
image:image,
desc:desc

});

alert("Card Updated Successfully");

closePopup();

}

//--------------------------------------------------==> Image / Video Card Toggle <==------------------------------------------------//

window.showImage=function(){

document.getElementById("imageForm").style.display="block";
document.getElementById("videoForm").style.display="none";

}

window.showVideo=function(){

document.getElementById("imageForm").style.display="none";
document.getElementById("videoForm").style.display="block";

}