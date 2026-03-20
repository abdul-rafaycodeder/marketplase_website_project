// Card data array (simulating database)
let cards = JSON.parse(localStorage.getItem('cards')) || [];
let currentEditId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderCards();
    setupEventListeners();
    updateLivePreview();
});

// Setup event listeners
function setupEventListeners() {
    // Live preview updates
    document.getElementById('name').addEventListener('input', updateLivePreview);
    document.getElementById('title').addEventListener('input', updateLivePreview);
    document.getElementById('image').addEventListener('input', updateLivePreview);
    document.getElementById('desc').addEventListener('input', updateLivePreview);
    
    // Theme toggle
    document.querySelector('.theme-toggle').addEventListener('click', toggleTheme);
    
    // Mobile menu
    document.querySelector('.mobile-menu').addEventListener('click', toggleMobileMenu);
    
    // Close popup on outside click
    window.addEventListener('click', (e) => {
        const popup = document.getElementById('editPopup');
        if (e.target === popup) {
            closePopup();
        }
    });
}

// Update live preview
function updateLivePreview() {
    const name = document.getElementById('name').value || 'Your Name';
    const title = document.getElementById('title').value || 'Card Title';
    const desc = document.getElementById('desc').value || 'Your description will appear here';
    const imageUrl = document.getElementById('image').value || 'https://via.placeholder.com/300x200?text=Preview';
    
    document.getElementById('previewName').textContent = name;
    document.getElementById('previewTitle').textContent = title;
    document.getElementById('previewDesc').textContent = desc;
    document.querySelector('.preview-image img').src = imageUrl;
}

// Create new card
function createCard() {
    const name = document.getElementById('name').value.trim();
    const title = document.getElementById('title').value.trim();
    const image = document.getElementById('image').value.trim();
    const desc = document.getElementById('desc').value.trim();
    
    // Validation
    if (!name || !title || !image || !desc) {
        showToast('Please fill in all fields', 'error');
        return;
    }
    
    // Create card object
    const card = {
        id: Date.now(),
        name,
        title,
        image,
        desc,
        date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    };
    
    // Add to array
    cards.unshift(card);
    
    // Save to localStorage
    localStorage.setItem('cards', JSON.stringify(cards));
    
    // Clear form
    document.getElementById('name').value = '';
    document.getElementById('title').value = '';
    document.getElementById('image').value = '';
    document.getElementById('desc').value = '';
    
    // Update preview
    updateLivePreview();
    
    // Render cards
    renderCards();
    
    // Show success message
    showToast('Card created successfully!', 'success');
}

// Render all cards
function renderCards() {
    const container = document.getElementById('cardContainer');
    
    if (cards.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-id-card"></i>
                <h3>No Cards Yet</h3>
                <p>Create your first card using the form above</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = cards.map(card => `
        <div class="card" data-id="${card.id}">
            <div class="card-image">
                <img src="${card.image}" alt="${card.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                <div class="card-badges">
                    <div class="badge edit" onclick="openEditPopup(${card.id})">
                        <i class="fas fa-edit"></i>
                    </div>
                    <div class="badge delete" onclick="deleteCard(${card.id})">
                        <i class="fas fa-trash"></i>
                    </div>
                </div>
            </div>
            <div class="card-content">
                <h3>${card.name}</h3>
                <h4>${card.title}</h4>
                <p>${card.desc}</p>
                <div class="card-footer">
                    <span class="card-date">
                        <i class="far fa-calendar-alt"></i> ${card.date}
                    </span>
                    <div class="card-actions">
                        <button class="action-btn edit" onclick="openEditPopup(${card.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteCard(${card.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Open edit popup
function openEditPopup(id) {
    const card = cards.find(c => c.id === id);
    if (!card) return;
    
    currentEditId = id;
    
    document.getElementById('editName').value = card.name;
    document.getElementById('editTitle').value = card.title;
    document.getElementById('editImage').value = card.image;
    document.getElementById('editDesc').value = card.desc;
    
    document.getElementById('editPopup').style.display = 'flex';
}

// Close popup
function closePopup() {
    document.getElementById('editPopup').style.display = 'none';
    currentEditId = null;
}

// Update card
function updateCard() {
    if (!currentEditId) return;
    
    const name = document.getElementById('editName').value.trim();
    const title = document.getElementById('editTitle').value.trim();
    const image = document.getElementById('editImage').value.trim();
    const desc = document.getElementById('editDesc').value.trim();
    
    if (!name || !title || !image || !desc) {
        showToast('Please fill in all fields', 'error');
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
        
        localStorage.setItem('cards', JSON.stringify(cards));
        renderCards();
        closePopup();
        showToast('Card updated successfully!', 'success');
    }
}

// Delete card
function deleteCard(id) {
    if (confirm('Are you sure you want to delete this card?')) {
        cards = cards.filter(c => c.id !== id);
        localStorage.setItem('cards', JSON.stringify(cards));
        renderCards();
        showToast('Card deleted successfully!', 'success');
    }
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const toastIcon = toast.querySelector('i');
    
    toastMessage.textContent = message;
    
    if (type === 'error') {
        toastIcon.style.color = 'var(--danger)';
        toastIcon.className = 'fas fa-exclamation-circle';
    } else {
        toastIcon.style.color = 'var(--success)';
        toastIcon.className = 'fas fa-check-circle';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const icon = document.querySelector('.theme-toggle i');
    
    if (document.body.classList.contains('dark-theme')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Toggle mobile menu
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    
    if (navLinks.style.display === 'flex') {
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.width = '100%';
        navLinks.style.flexDirection = 'column';
        navLinks.style.background = 'white';
        navLinks.style.padding = '1rem';
        navLinks.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navLinks.style = '';
    }
}

// Make functions global for onclick handlers
window.createCard = createCard;
window.openEditPopup = openEditPopup;
window.closePopup = closePopup;
window.updateCard = updateCard;
window.deleteCard = deleteCard;