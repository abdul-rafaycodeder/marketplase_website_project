// Card data array
let cards = JSON.parse(localStorage.getItem('cards')) || [];
let currentEditId = null;

// DOM Elements
const cardContainer = document.getElementById('cardContainer');
const editPopup = document.getElementById('editPopup');
const totalCardsSpan = document.getElementById('totalCards');

// Live Preview Elements
const nameInput = document.getElementById('name');
const titleInput = document.getElementById('title');
const imageInput = document.getElementById('image');
const descInput = document.getElementById('desc');
const previewName = document.getElementById('previewName');
const previewTitle = document.getElementById('previewTitle');
const previewDesc = document.getElementById('previewDesc');
const previewImage = document.getElementById('previewImage');

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    displayCards();
    updateTotalCards();
    setupEventListeners();
    setupLivePreview();
});

// Setup Event Listeners
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', toggleTheme);
}

// Live Preview
function setupLivePreview() {
    const inputs = [nameInput, titleInput, imageInput, descInput];

    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', updateLivePreview);
        }
    });
}

function updateLivePreview() {
    if (previewName) {
        previewName.textContent = nameInput.value || 'Name';
        previewTitle.textContent = titleInput.value || 'Title';
        previewDesc.textContent = descInput.value || 'Description will appear here...';

        if (imageInput.value) {
            previewImage.src = imageInput.value;
            previewImage.onerror = () => {
                previewImage.src = 'https://via.placeholder.com/300x200?text=Invalid+Image';
            };
        } else {
            previewImage.src = 'https://via.placeholder.com/300x200?text=Preview+Image';
        }
    }
}

// Create Card
window.createCard = function () {
    const name = nameInput.value.trim();
    const title = titleInput.value.trim();
    const image = imageInput.value.trim();
    const desc = descInput.value.trim();

    if (!name || !title || !image || !desc) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const newCard = {
        id: Date.now(),
        name,
        title,
        image,
        desc,
        createdAt: new Date().toISOString()
    };

    cards.push(newCard);
    saveToLocalStorage();
    displayCards();
    resetForm();
    updateTotalCards();
    showNotification('Card created successfully!', 'success');
};

// Display Cards
function displayCards() {
    if (!cardContainer) return;

    if (cards.length === 0) {
        cardContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-layer-group"></i>
                <h3>No Cards Yet</h3>
                <p>Create your first card using the form above!</p>
            </div>
        `;
        return;
    }

    cardContainer.innerHTML = cards.map(card => `
        <div class="card" data-id="${card.id}">
            <div class="card-image">
                <img src="${card.image}" alt="${card.title}" 
                     onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                <div class="card-actions">
                    <button class="edit-btn" onclick="openEditPopup(${card.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteCard(${card.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <h3>${card.name}</h3>
                <h4>${card.title}</h4>
                <p>${card.desc}</p>
                <small>${new Date(card.createdAt).toLocaleDateString()}</small>
            </div>
        </div>
    `).join('');
}

// Open Edit Popup
window.openEditPopup = function (id) {
    const card = cards.find(c => c.id === id);
    if (!card) return;

    currentEditId = id;
    document.getElementById('editName').value = card.name;
    document.getElementById('editTitle').value = card.title;
    document.getElementById('editImage').value = card.image;
    document.getElementById('editDesc').value = card.desc;

    editPopup.style.display = 'flex';
};

// Close Popup
window.closePopup = function () {
    editPopup.style.display = 'none';
    currentEditId = null;
};

// Update Card
window.updateCard = function () {
    if (!currentEditId) return;

    const name = document.getElementById('editName').value.trim();
    const title = document.getElementById('editTitle').value.trim();
    const image = document.getElementById('editImage').value.trim();
    const desc = document.getElementById('editDesc').value.trim();

    if (!name || !title || !image || !desc) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    const index = cards.findIndex(c => c.id === currentEditId);
    if (index !== -1) {
        cards[index] = {
            ...cards[index],
            name,
            title,
            image,
            desc
        };

        saveToLocalStorage();
        displayCards();
        closePopup();
        showNotification('Card updated successfully!', 'success');
    }
};

// Delete Card
window.deleteCard = function (id) {
    if (confirm('Are you sure you want to delete this card?')) {
        cards = cards.filter(c => c.id !== id);
        saveToLocalStorage();
        displayCards();
        updateTotalCards();
        showNotification('Card deleted successfully!', 'success');
    }
};

// Reset Form
function resetForm() {
    document.getElementById('cardForm').reset();
    updateLivePreview();
}

// Save to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('cards', JSON.stringify(cards));
}

// Update Total Cards
function updateTotalCards() {
    if (totalCardsSpan) {
        totalCardsSpan.textContent = cards.length;
    }
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Toggle Theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('#themeToggle i');
    if (icon) {
        icon.classList.toggle('fa-moon');
        icon.classList.toggle('fa-sun');
    }
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        background: white;
        box-shadow: var(--shadow-lg);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        z-index: 3000;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        background: var(--success-color);
        color: white;
    }
    
    .notification.error {
        background: var(--danger-color);
        color: white;
    }
    
    .empty-state {
        text-align: center;
        padding: 
`
