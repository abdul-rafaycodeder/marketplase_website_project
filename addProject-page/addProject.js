// // function createCard() {

// //     let name = document.getElementById("name").value;
// //     let title = document.getElementById("title").value;
// //     let image = document.getElementById("image").value;
// //     let desc = document.getElementById("desc").value;

// //     if (name === "" || title === "" || image === "" || desc === "") {
// //         alert("Please fill all fields");
// //         return;
// //     }

// //     let card = `
// // <div class="card">

// // <img src="${image}">

// // <div class="card-content">

// // <h3>${name}</h3>

// // <h4>${title}</h4>

// // <p>${desc}</p>

// // </div>

// // </div>
// // `;

// //     document.getElementById("cardContainer").innerHTML += card;

// // }

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

// import {
//     getDatabase,
//     ref,
//     push,
//     onValue,
//     remove,
//     update
// } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";


// const firebaseConfig = {
//     apiKey: "AIzaSyAOoM5Mo0h0bkJHdRRT_DCEVIcqMlY7kzo",
//     authDomain: "marketplase-project.firebaseapp.com",
//     databaseURL: "https://marketplase-project-default-rtdb.firebaseio.com",
//     projectId: "marketplase-project",
//     storageBucket: "marketplase-project.firebasestorage.app",
//     messagingSenderId: "539266350649",
//     appId: "1:539266350649:web:d32217bb184a7b6f00d7e8"
// };

// const app = initializeApp(firebaseConfig);
// const db = getDatabase(app);
// const cardRef = ref(db, "cards");

// //--------------------------------------------------==> Create Card <==------------------------------------------------//

// function createCard() {

//     let name = document.getElementById("name").value;
//     let title = document.getElementById("title").value;
//     let image = document.getElementById("image").value;
//     let desc = document.getElementById("desc").value;

//     if (name === "" || title === "" || image === "" || desc === "") {
//         alert("Please fill all fields");
//         return;
//     }

//     push(cardRef, {
//         name: name,
//         title: title,
//         image: image,
//         desc: desc
//     });

//     alert("Card Created Successfully");

// }

// window.createCard = createCard;


// //--------------------------------------------------==> Realtime Card Load (Refresh ke baad bhi rahega) <==------------------------------------------------//


// onValue(cardRef, (snapshot) => {

//     let container = document.getElementById("cardContainer");

//     container.innerHTML = "";

//     snapshot.forEach((data) => {

//         let card = data.val();
//         let key = data.key;

//         container.innerHTML += `

// <div class="card">

// <img src="${card.image}">

// <div class="card-content">

// <h3>${card.name}</h3>
// <h4>${card.title}</h4>
// <p>${card.desc}</p>

// <button onclick="editCard('${key}')">Edit</button>
// <button onclick="deleteCard('${key}')">Delete</button>

// </div>

// </div>

// `;

//     });

// });


// //--------------------------------------------------==> Delete Card (Confirm Popup) <==------------------------------------------------//

// window.deleteCard = function (key) {

//     let confirmDelete = confirm("Are you sure you want to delete this card?");

//     if (confirmDelete) {

//         remove(ref(db, "cards/" + key));

//         alert("Card Deleted");

//     }

// }


// //--------------------------------------------------==> Edit Card Popup <==------------------------------------------------//

// let currentKey = "";

// window.editCard = function (key) {

//     currentKey = key;

//     document.getElementById("editPopup").style.display = "flex";

// }

// window.closePopup = function () {

//     document.getElementById("editPopup").style.display = "none";

// }

// //--------------------------------------------------==> Update Card <==------------------------------------------------//

// window.updateCard=function(){

// let name=document.getElementById("editName").value;
// let title=document.getElementById("editTitle").value;
// let image=document.getElementById("editImage").value;
// let desc=document.getElementById("editDesc").value;

// update(ref(db,"cards/"+currentKey),{

// name:name,
// title:title,
// image:image,
// desc:desc

// });

// alert("Card Updated Successfully");

// closePopup();

// }

// //--------------------------------------------------==> Image / Video Card Toggle <==------------------------------------------------//

// window.showImage=function(){

// document.getElementById("imageForm").style.display="block";
// document.getElementById("videoForm").style.display="none";

// }

// window.showVideo=function(){

// document.getElementById("imageForm").style.display="none";
// document.getElementById("videoForm").style.display="block";

// }


// ===============================================================================================================================================
// ===============================================================================================================================================


import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
    getDatabase,
    ref,
    push,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAOoM5Mo0h0bkJHdRRT_DCEVIcqMlY7kzo",
    authDomain: "marketplase-project.firebaseapp.com",
    databaseURL: "https://marketplase-project-default-rtdb.firebaseio.com",
    projectId: "marketplase-project",
    storageBucket: "marketplase-project.firebasestorage.app",
    messagingSenderId: "539266350649",
    appId: "1:539266350649:web:d32217bb184a7b6f00d7e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const cardRef = ref(db, "cards");

// Global Variables
let currentKey = "";

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadCards();
});

// Setup event listeners
function setupEventListeners() {
    // Live preview updates
    const inputs = ['name', 'title', 'image', 'desc'];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateLivePreview);
        }
    });
    
    // Theme toggle
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Mobile menu
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.addEventListener('click', toggleMobileMenu);
    }
    
    // Close popup on outside click
    window.addEventListener('click', (e) => {
        const popup = document.getElementById('editPopup');
        if (e.target === popup) {
            closePopup();
        }
    });
}

//--------------------------------------------------==> Create Card <==------------------------------------------------//

window.createCard = function() {
    let name = document.getElementById("name").value.trim();
    let title = document.getElementById("title").value.trim();
    let image = document.getElementById("image").value.trim();
    let desc = document.getElementById("desc").value.trim();

    if (name === "" || title === "" || image === "" || desc === "") {
        showToast("Please fill all fields", "error");
        return;
    }

    // Create card object with timestamp
    const cardData = {
        name: name,
        title: title,
        image: image,
        desc: desc,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        }),
        timestamp: Date.now()
    };

    push(cardRef, cardData)
        .then(() => {
            showToast("Card Created Successfully", "success");
            
            // Clear form
            document.getElementById("name").value = "";
            document.getElementById("title").value = "";
            document.getElementById("image").value = "";
            document.getElementById("desc").value = "";
            
            // Update preview
            updateLivePreview();
        })
        .catch((error) => {
            showToast("Error creating card: " + error.message, "error");
        });
}

//--------------------------------------------------==> Load Cards (Realtime) <==------------------------------------------------//

function loadCards() {
    onValue(cardRef, (snapshot) => {
        let container = document.getElementById("cardContainer");
        
        if (!container) return;
        
        container.innerHTML = "";

        if (!snapshot.exists()) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-id-card"></i>
                    <h3>No Cards Yet</h3>
                    <p>Create your first card using the form above</p>
                </div>
            `;
            return;
        }

        let cardsArray = [];
        
        snapshot.forEach((data) => {
            let card = data.val();
            let key = data.key;
            
            // Add key to card object
            card.key = key;
            cardsArray.push(card);
        });

        // Sort by timestamp (newest first)
        cardsArray.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        cardsArray.forEach((card) => {
            container.innerHTML += `
                <div class="card" data-id="${card.key}">
                    <div class="card-image">
                        <img src="${card.image}" alt="${card.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                        <div class="card-badges">
                            <div class="badge edit" onclick="editCard('${card.key}')">
                                <i class="fas fa-edit"></i>
                            </div>
                            <div class="badge delete" onclick="deleteCard('${card.key}')">
                                <i class="fas fa-trash"></i>
                            </div>
                        </div>
                    </div>
                    <div class="card-content">
                        <h3>${card.name || 'No Name'}</h3>
                        <h4>${card.title || 'No Title'}</h4>
                        <p>${card.desc || 'No Description'}</p>
                        <div class="card-footer">
                            <span class="card-date">
                                <i class="far fa-calendar-alt"></i> ${card.date || new Date().toLocaleDateString()}
                            </span>
                            <div class="card-actions">
                                <button class="action-btn edit" onclick="editCard('${card.key}')">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="action-btn delete" onclick="deleteCard('${card.key}')">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
    });
}

//--------------------------------------------------==> Delete Card <==------------------------------------------------//

window.deleteCard = function(key) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, delete it!',
        background: '#fff',
        backdrop: 'rgba(0,0,0,0.5)'
    }).then((result) => {
        if (result.isConfirmed) {
            remove(ref(db, "cards/" + key))
                .then(() => {
                    Swal.fire(
                        'Deleted!',
                        'Your card has been deleted.',
                        'success'
                    );
                })
                .catch((error) => {
                    showToast("Error deleting card: " + error.message, "error");
                });
        }
    });
}

//--------------------------------------------------==> Edit Card Popup <==------------------------------------------------//

window.editCard = function(key) {
    currentKey = key;
    
    // Get card data from Firebase
    onValue(ref(db, "cards/" + key), (snapshot) => {
        const card = snapshot.val();
        if (card) {
            document.getElementById("editName").value = card.name || '';
            document.getElementById("editTitle").value = card.title || '';
            document.getElementById("editImage").value = card.image || '';
            document.getElementById("editDesc").value = card.desc || '';
            
            document.getElementById("editPopup").style.display = "flex";
        }
    }, { onlyOnce: true });
}

window.closePopup = function() {
    document.getElementById("editPopup").style.display = "none";
    currentKey = "";
}

//--------------------------------------------------==> Update Card <==------------------------------------------------//

window.updateCard = function() {
    if (!currentKey) {
        showToast("No card selected for editing", "error");
        return;
    }

    let name = document.getElementById("editName").value.trim();
    let title = document.getElementById("editTitle").value.trim();
    let image = document.getElementById("editImage").value.trim();
    let desc = document.getElementById("editDesc").value.trim();

    if (name === "" || title === "" || image === "" || desc === "") {
        showToast("Please fill all fields", "error");
        return;
    }

    update(ref(db, "cards/" + currentKey), {
        name: name,
        title: title,
        image: image,
        desc: desc,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    })
    .then(() => {
        showToast("Card Updated Successfully", "success");
        closePopup();
    })
    .catch((error) => {
        showToast("Error updating card: " + error.message, "error");
    });
}

//--------------------------------------------------==> Image / Video Card Toggle <==------------------------------------------------//

window.showImage = function() {
    const imageForm = document.getElementById("imageForm");
    const videoForm = document.getElementById("videoForm");
    
    if (imageForm) imageForm.style.display = "block";
    if (videoForm) videoForm.style.display = "none";
}

window.showVideo = function() {
    const imageForm = document.getElementById("imageForm");
    const videoForm = document.getElementById("videoForm");
    
    if (imageForm) imageForm.style.display = "none";
    if (videoForm) videoForm.style.display = "block";
}

//--------------------------------------------------==> Live Preview <==------------------------------------------------//

function updateLivePreview() {
    const name = document.getElementById('name')?.value || 'Your Name';
    const title = document.getElementById('title')?.value || 'Card Title';
    const desc = document.getElementById('desc')?.value || 'Your description will appear here';
    const imageUrl = document.getElementById('image')?.value || 'https://via.placeholder.com/300x200?text=Preview';
    
    const previewName = document.getElementById('previewName');
    const previewTitle = document.getElementById('previewTitle');
    const previewDesc = document.getElementById('previewDesc');
    const previewImage = document.querySelector('.preview-image img');
    
    if (previewName) previewName.textContent = name;
    if (previewTitle) previewTitle.textContent = title;
    if (previewDesc) previewDesc.textContent = desc;
    if (previewImage) previewImage.src = imageUrl;
}

//--------------------------------------------------==> Toast Notification <==------------------------------------------------//

function showToast(message, type = 'success') {
    // You can use SweetAlert for better notifications
    Swal.fire({
        title: type === 'success' ? 'Success!' : 'Error!',
        text: message,
        icon: type,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
        background: '#fff',
        timerProgressBar: true
    });
}

//--------------------------------------------------==> Theme Toggle <==------------------------------------------------//

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('.theme-toggle i');
    
    if (icon) {
        if (document.body.classList.contains('dark-theme')) {
            icon.className = 'fas fa-sun';
            // Add dark theme styles
            document.documentElement.style.setProperty('--light', '#1e293b');
            document.documentElement.style.setProperty('--dark', '#f8fafc');
            document.documentElement.style.setProperty('--gray-light', '#334155');
        } else {
            icon.className = 'fas fa-moon';
            // Reset to light theme
            document.documentElement.style.setProperty('--light', '#f8fafc');
            document.documentElement.style.setProperty('--dark', '#0f172a');
            document.documentElement.style.setProperty('--gray-light', '#e2e8f0');
        }
    }
}

//--------------------------------------------------==> Mobile Menu Toggle <==------------------------------------------------//

function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (!navLinks) return;
    
    if (navLinks.style.display === 'flex') {
        navLinks.style = '';
    } else {
        navLinks.style.display = 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.flexDirection = 'column';
        navLinks.style.background = 'white';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        navLinks.style.zIndex = '1000';
    }
}

// Make all functions globally available
window.toggleTheme = toggleTheme;
window.toggleMobileMenu = toggleMobileMenu;
window.updateLivePreview = updateLivePreview;