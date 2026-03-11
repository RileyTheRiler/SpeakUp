const SHOP_ITEMS = [
    { id: 'theme-ocean', name: 'Ocean Theme', icon: 'fa-water', cost: 50, color1: '#4facfe', color2: '#00f2fe' },
    { id: 'theme-forest', name: 'Forest Theme', icon: 'fa-tree', cost: 75, color1: '#43e97b', color2: '#38f9d7' },
    { id: 'theme-sunset', name: 'Sunset Theme', icon: 'fa-sun', cost: 100, color1: '#fa709a', color2: '#fee140' },
    { id: 'theme-dark', name: 'Night Mode', icon: 'fa-moon', cost: 150, color1: '#243949', color2: '#517fa4' }
];

const shopContainer = document.getElementById('shop-container');

function getOwnedItems() {
    return JSON.parse(localStorage.getItem('speakup_owned_themes') || '[]');
}

function getActiveTheme() {
    return localStorage.getItem('speakup_active_theme') || 'default';
}

function renderShop() {
    const owned = getOwnedItems();
    const active = getActiveTheme();
    const stars = ProgressionSystem.getStars();

    shopContainer.innerHTML = SHOP_ITEMS.map(item => {
        const isOwned = owned.includes(item.id);
        const isActive = active === item.id;
        const canAfford = stars >= item.cost;

        let btnState = '';
        if (isActive) {
            btnState = `<button class="buy-btn" disabled style="background: var(--dark);">Active</button>`;
        } else if (isOwned) {
            btnState = `<button class="buy-btn apply-btn" onclick="applyTheme('${item.id}')">Use Theme</button>`;
        } else if (canAfford) {
            btnState = `<button class="buy-btn" onclick="buyItem('${item.id}', ${item.cost})">Buy</button>`;
        } else {
            btnState = `<button class="buy-btn" disabled>Not Enough Stars</button>`;
        }

        return `
            <div class="shop-item ${isOwned ? 'owned' : ''}">
                <i class="fa-solid ${item.icon}" style="background: linear-gradient(-45deg, ${item.color1}, ${item.color2}); -webkit-background-clip: text; -webkit-text-fill-color:transparent;"></i>
                <h3>${item.name}</h3>
                ${!isOwned ? `<div class="price-tag"><i class="fa-solid fa-star"></i> ${item.cost}</div>` : ''}
                ${btnState}
            </div>
        `;
    }).join('');
}

window.buyItem = (id, cost) => {
    const stars = ProgressionSystem.getStars();
    if (stars >= cost) {
        // Deduct
        localStorage.setItem('speakup_stars', stars - cost);
        ProgressionSystem.updateUI();
        audioUtils.playDing();

        // Add to owned
        const owned = getOwnedItems();
        owned.push(id);
        localStorage.setItem('speakup_owned_themes', JSON.stringify(owned));

        // Auto-apply
        applyTheme(id);
    }
};

window.applyTheme = (id) => {
    localStorage.setItem('speakup_active_theme', id);
    uiUtils.applyThemeToDocument(); // Method we need to add to utils.js later
    renderShop();
    audioUtils.playSparkle();
};

document.addEventListener('DOMContentLoaded', renderShop);
