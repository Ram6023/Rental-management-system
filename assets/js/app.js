/**
 * ============================================
 * App Module — Shared UI & Logic
 * ============================================
 */

/* ── Format price ── */
function formatPrice(amount) {
    return '₹' + Number(amount).toLocaleString('en-IN');
}

/* ── Toast Notification ── */
function showToast(message, type = 'success') {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    const icons = { success: 'check-circle-fill', danger: 'exclamation-circle-fill', warning: 'exclamation-triangle-fill', info: 'info-circle-fill' };
    const toast = document.createElement('div');
    toast.className = `custom-toast toast-${type}`;
    toast.innerHTML = `<i class="bi bi-${icons[type] || icons.info}"></i><span>${message}</span>`;
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 3500);
}

/* ── Dark Mode Toggle ── */
function initThemeToggle() {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', saved);
    const btn = document.getElementById('themeToggle');
    if (btn) {
        updateThemeIcon(btn, saved);
        btn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-bs-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-bs-theme', next);
            localStorage.setItem('theme', next);
            updateThemeIcon(btn, next);
        });
    }
}

function updateThemeIcon(btn, theme) {
    btn.innerHTML = theme === 'dark' ? '<i class="bi bi-sun-fill"></i>' : '<i class="bi bi-moon-fill"></i>';
}

/* ── Render Navbar ── */
async function renderNavbar(profile = null) {
    const nav = document.getElementById('navbar');
    if (!nav) return;

    const user = await getUser();
    const role = profile?.role || null;
    const name = profile?.name || '';
    const initial = name ? name.charAt(0).toUpperCase() : '?';

    let navLinks = '';

    if (user && role) {
        if (role === 'tenant') {
            navLinks = `
                <li class="nav-item"><a class="nav-link" href="${PAGES}/home.html"><i class="bi bi-house-door"></i> Home</a></li>
                <li class="nav-item"><a class="nav-link" href="${PAGES}/properties.html"><i class="bi bi-building"></i> Properties</a></li>
                <li class="nav-item"><a class="nav-link" href="${PAGES}/wishlist.html"><i class="bi bi-heart"></i> Wishlist</a></li>
                <li class="nav-item"><a class="nav-link" href="${PAGES}/messages.html"><i class="bi bi-chat-dots"></i> Messages</a></li>`;
        } else if (role === 'owner') {
            navLinks = `
                <li class="nav-item"><a class="nav-link" href="${PAGES}/owner-dashboard.html"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
                <li class="nav-item"><a class="nav-link" href="${PAGES}/add-property.html"><i class="bi bi-plus-circle"></i> Add Property</a></li>
                <li class="nav-item"><a class="nav-link" href="${PAGES}/my-properties.html"><i class="bi bi-buildings"></i> My Properties</a></li>
                <li class="nav-item"><a class="nav-link" href="${PAGES}/messages.html"><i class="bi bi-chat-dots"></i> Messages</a></li>`;
        } else if (role === 'admin') {
            navLinks = `
                <li class="nav-item"><a class="nav-link" href="${PAGES}/admin-dashboard.html"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
                <li class="nav-item"><a class="nav-link" href="${PAGES}/properties.html"><i class="bi bi-building"></i> Properties</a></li>
                <li class="nav-item"><a class="nav-link" href="${PAGES}/add-property.html"><i class="bi bi-plus-circle"></i> Add Property</a></li>`;
        }
        navLinks += `<li class="nav-item"><a class="nav-link" href="${PAGES}/payments.html"><i class="bi bi-credit-card"></i> Payments</a></li>`;
        navLinks += `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle user-menu" href="#" data-bs-toggle="dropdown">
                    <div class="user-avatar">${initial}</div>
                    <span class="d-none d-lg-inline">${escHtml(name)}</span>
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><span class="dropdown-item-text text-muted small">${capitalize(role)}</span></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="${PAGES}/profile.html"><i class="bi bi-person"></i> Profile</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item text-danger" href="#" onclick="signOut()"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
                </ul>
            </li>`;
    } else {
        navLinks = `
            <li class="nav-item"><a class="nav-link" href="${BASE}/index.html"><i class="bi bi-house-door"></i> Home</a></li>
            <li class="nav-item"><a class="nav-link" href="${PAGES}/login.html"><i class="bi bi-box-arrow-in-right"></i> Login</a></li>
            <li class="nav-item"><a class="btn btn-primary btn-sm ms-2 px-3" href="${PAGES}/register.html"><i class="bi bi-person-plus"></i> Register</a></li>`;
    }

    nav.className = 'navbar navbar-expand-lg fixed-top';
    nav.id = 'mainNav';
    nav.innerHTML = `
        <div class="container">
            <a class="navbar-brand" href="${BASE}/index.html">
                <i class="bi bi-houses-fill brand-icon"></i>
                <span class="brand-text">Rent<span class="brand-accent">Ease</span></span>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
                    ${navLinks}
                    <li class="nav-item ms-2">
                        <button class="btn btn-link nav-link theme-toggle" id="themeToggle" title="Toggle theme">
                            <i class="bi bi-moon-fill"></i>
                        </button>
                    </li>
                </ul>
            </div>
        </div>`;
    initThemeToggle();
}

/* ── Render Footer ── */
function renderFooter() {
    const el = document.getElementById('footer');
    if (!el) return;
    el.innerHTML = `
        <footer class="site-footer">
            <div class="footer-wave">
                <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="var(--bg-primary)"></path>
                </svg>
            </div>
            <div class="container text-center py-4">
                <p class="mb-1"><i class="bi bi-houses-fill text-primary"></i> <strong>Rent<span class="text-primary">Ease</span></strong></p>
                <p class="small text-muted mb-0">&copy; ${new Date().getFullYear()} RentEase. All rights reserved.</p>
            </div>
        </footer>`;
}

/* ── Property Card Renderer ── */
function renderPropertyCard(p, ownerName = '', showWishlist = false, isWishlisted = false) {
    const imgSrc = p.image_url || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop';
    const featured = p.is_featured ? '<span class="badge badge-featured"><i class="bi bi-star-fill"></i> Featured</span>' : '';
    const statusBadge = `<span class="badge badge-${p.status === 'available' ? 'available' : 'rented'}">${capitalize(p.status)}</span>`;
    const wishBtn = showWishlist ? `
        <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${p.id}', this)" title="Wishlist">
            <i class="bi bi-heart${isWishlisted ? '-fill' : ''}"></i>
        </button>` : '';

    return `
        <div class="col-lg-4 col-md-6" id="prop-${p.id}">
            <div class="property-card">
                <div class="card-img-wrapper">
                    <img src="${imgSrc}" alt="${escHtml(p.title)}" loading="lazy"
                         onerror="this.style.display='none';this.parentElement.innerHTML='<div class=\\'property-img-placeholder\\'><i class=\\'bi bi-image\\'></i></div>'">
                    <div class="card-badges">${featured}${statusBadge}</div>
                    ${wishBtn}
                </div>
                <div class="card-body">
                    <div class="card-price">${formatPrice(p.price)} <span>/month</span></div>
                    <h5 class="card-title-text">${escHtml(p.title)}</h5>
                    <div class="card-location"><i class="bi bi-geo-alt-fill"></i> ${escHtml(p.location)}</div>
                    <div class="card-features">
                        <div class="feature-item"><i class="bi bi-house-door"></i> ${p.bhk} BHK</div>
                        ${ownerName ? `<div class="feature-item"><i class="bi bi-person"></i> ${escHtml(ownerName)}</div>` : ''}
                    </div>
                    <div class="card-actions">
                        <a href="${PAGES}/property-detail.html?id=${p.id}" class="btn btn-primary btn-sm"><i class="bi bi-eye"></i> View</a>
                        <a href="https://wa.me/${p.phone}?text=${encodeURIComponent('Hi, interested in: ' + p.title)}" target="_blank" class="btn btn-whatsapp btn-sm"><i class="bi bi-whatsapp"></i> Contact</a>
                    </div>
                </div>
            </div>
        </div>`;
}

/* ── Load & Render Properties ── */
async function loadProperties(containerId, filters = {}, limit = 50) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<div class="loading-spinner"><div class="spinner-border" role="status"></div></div>';

    let query = sb.from('properties').select('*, profiles!properties_owner_id_fkey(name)');

    if (filters.featured) query = query.eq('is_featured', true);
    if (filters.location) query = query.ilike('location', `%${filters.location}%`);
    if (filters.budget) query = query.lte('price', parseFloat(filters.budget));
    if (filters.bhk) query = query.eq('bhk', parseInt(filters.bhk));
    if (filters.owner_id) query = query.eq('owner_id', filters.owner_id);

    query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false }).limit(limit);

    const { data: properties, error } = await query;

    if (error || !properties?.length) {
        container.innerHTML = `<div class="empty-state"><i class="bi bi-buildings"></i><h4>No Properties Found</h4><p>${error ? error.message : 'Try adjusting your search filters'}</p></div>`;
        return;
    }

    // Check wishlist status if logged in
    const user = await getUser();
    let wishlistedIds = new Set();
    if (user) {
        const { data: wl } = await sb.from('wishlist').select('property_id').eq('user_id', user.id);
        if (wl) wl.forEach(w => wishlistedIds.add(w.property_id));
    }

    container.innerHTML = properties.map(p =>
        renderPropertyCard(p, p.profiles?.name || '', !!user, wishlistedIds.has(p.id))
    ).join('');
}

/* ── Search Properties ── */
function searchProperties() {
    const loc = document.getElementById('searchLocation')?.value || '';
    const budget = document.getElementById('searchBudget')?.value || '';
    const bhk = document.getElementById('searchBHK')?.value || '';
    loadProperties('allProperties', { location: loc, budget, bhk });
}

/* ── Toggle Wishlist ── */
async function toggleWishlist(propertyId, btn) {
    const user = await getUser();
    if (!user) { showToast('Please login first', 'warning'); return; }

    const { data: existing } = await sb.from('wishlist').select('id').eq('user_id', user.id).eq('property_id', propertyId);

    if (existing?.length) {
        await sb.from('wishlist').delete().eq('user_id', user.id).eq('property_id', propertyId);
        if (btn) { btn.classList.remove('active'); btn.innerHTML = '<i class="bi bi-heart"></i>'; }
        showToast('Removed from wishlist', 'info');
    } else {
        await sb.from('wishlist').insert({ user_id: user.id, property_id: propertyId });
        if (btn) { btn.classList.add('active'); btn.innerHTML = '<i class="bi bi-heart-fill"></i>'; }
        showToast('Added to wishlist', 'success');
    }
}

/* ── Messages ── */
async function loadMessages(otherUserId) {
    const user = await getUser();
    if (!user) return;
    const container = document.getElementById('messagesBody');
    if (!container) return;

    const { data: msgs } = await sb.from('messages').select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

    if (!msgs?.length) {
        container.innerHTML = '<div class="text-center text-muted p-4"><p>No messages yet. Say hello!</p></div>';
        return;
    }

    container.innerHTML = msgs.map(m => `
        <div class="message-bubble ${m.sender_id === user.id ? 'sent' : 'received'}">
            <p class="mb-1">${escHtml(m.message)}</p>
            <small class="message-time">${new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
        </div>`).join('');

    container.scrollTop = container.scrollHeight;

    // Mark as read
    await sb.from('messages').update({ is_read: true }).eq('sender_id', otherUserId).eq('receiver_id', user.id).eq('is_read', false);
}

async function sendMessage(receiverId, propertyId) {
    const user = await getUser();
    if (!user) return;
    const input = document.getElementById('messageInput');
    const msg = input.value.trim();
    if (!msg) return;

    const data = { sender_id: user.id, receiver_id: receiverId, message: msg };
    if (propertyId) data.property_id = propertyId;

    const { error } = await sb.from('messages').insert(data);
    if (error) { showToast('Failed to send', 'danger'); return; }

    input.value = '';
    loadMessages(receiverId);
}

/* ── Delete confirmation ── */
async function confirmDeleteProperty(id, title) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    const { error } = await sb.from('properties').delete().eq('id', id);
    if (error) { showToast('Failed to delete: ' + error.message, 'danger'); return; }
    showToast('Property deleted', 'success');
    const el = document.getElementById('prop-' + id);
    if (el) { el.style.opacity = '0'; el.style.transform = 'scale(0.9)'; setTimeout(() => el.remove(), 300); }
    else setTimeout(() => location.reload(), 500);
}

/* ── Image preview ── */
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    if (input.files?.[0]) {
        const reader = new FileReader();
        reader.onload = e => { preview.src = e.target.result; preview.style.display = 'block'; };
        reader.readAsDataURL(input.files[0]);
    }
}

/* ── Upload image to Supabase Storage ── */
async function uploadPropertyImage(file) {
    if (!file) return '';
    const ext = file.name.split('.').pop();
    const name = `property_${Date.now()}_${Math.random().toString(36).substr(2, 6)}.${ext}`;
    const { error } = await sb.storage.from('property-images').upload(name, file, { contentType: file.type });
    if (error) { console.error('Upload error:', error); return ''; }
    const { data } = sb.storage.from('property-images').getPublicUrl(name);
    return data.publicUrl;
}

/* ── Helpers ── */
function escHtml(s) { const d = document.createElement('div'); d.textContent = s || ''; return d.innerHTML; }
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function getUrlParam(key) { return new URLSearchParams(window.location.search).get(key); }

/* ── Page init helper ── */
async function initPage(options = {}) {
    const { auth = false, role = null, onReady = null } = options;

    let profile = null;
    if (auth) {
        const result = role === 'owner' ? await requireOwner() :
                       role === 'admin' ? await requireAdmin() :
                       await requireAuth();
        if (!result) return;
        profile = result.profile;
    } else {
        const user = await getUser();
        if (user) profile = await getProfile(user.id);
    }

    await renderNavbar(profile);
    renderFooter();

    if (onReady) await onReady(profile);
}
