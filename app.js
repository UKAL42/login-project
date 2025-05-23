// DOM Elementleri
const authContainer = document.getElementById('auth-container');
const mainContainer = document.getElementById('main-container');
const loginFormContainer = document.getElementById('login-form-container');
const registerFormContainer = document.getElementById('register-form-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const productsSection = document.getElementById('products-section');
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartItems = document.getElementById('cart-items');
const checkoutBtn = document.getElementById('checkout-btn');
const paymentSection = document.getElementById('payment-section');
const notification = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');

// Modal Elementleri
const cartModal = new bootstrap.Modal(document.getElementById('cart-modal'));
const paymentModal = new bootstrap.Modal(document.getElementById('payment-modal'));

// Hesap Modalı için Bootstrap nesnesi
const accountBtn = document.getElementById('account-btn');
const accountModal = new bootstrap.Modal(document.getElementById('account-modal'));
const accountInfoSection = document.getElementById('account-info-section');
const accountLogoutBtn = document.getElementById('account-logout-btn');
const backToCartBtn = document.getElementById('back-to-cart-btn');

// Ürünler
const PRODUCTS = {
    elektronik: [
        { id: 1, name: 'iPhone 13', price: 25000, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80' },
        { id: 2, name: 'Samsung Galaxy S21', price: 20000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80' },
        { id: 3, name: 'MacBook Pro', price: 35000, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80' }
    ],
    kitap: [
        { id: 4, name: 'Suç ve Ceza', price: 50, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=400&q=80' },
        { id: 5, name: '1984', price: 45, image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
        { id: 6, name: 'Sefiller', price: 55, image: 'https://images.unsplash.com/photo-1455885664032-7c937c0d3a19?auto=format&fit=crop&w=400&q=80' }
    ],
    giyim: [
        { id: 7, name: 'Kot Pantolon', price: 300, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
        { id: 8, name: 'T-shirt', price: 150, image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80' },
        { id: 9, name: 'Spor Ayakkabı', price: 800, image: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80' }
    ]
};

// State
let currentUser = null;
let currentCategory = 'elektronik';
let cart = [];

// LocalStorage İşlemleri
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

// Bildirim Sistemi
function showNotification(message, type = 'success') {
    Swal.fire({
        text: message,
        icon: type === 'error' ? 'error' : 'success',
        confirmButtonText: 'Tamam',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        position: 'top',
        toast: true,
        customClass: {
            popup: 'swal2-popup-custom'
        }
    });
}

function hideNotification() {
    // SweetAlert2 popup'ı otomatik kapanıyor, ekstra işleme gerek yok.
}

// Form İşlemleri
function showLoginForm() {
    registerFormContainer.classList.add('d-none');
    loginFormContainer.classList.remove('d-none');
    loginForm.reset();
    
    // Inputları aktif et
    const inputs = loginForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = false;
        input.readOnly = false;
    });
    
    // İlk inputa focus ver
    setTimeout(() => {
        inputs[0].focus();
    }, 100);
}

function showRegisterForm() {
    loginFormContainer.classList.add('d-none');
    registerFormContainer.classList.remove('d-none');
    registerForm.reset();
    
    // Inputları aktif et
    const inputs = registerForm.querySelectorAll('input');
    inputs.forEach(input => {
        input.disabled = false;
        input.readOnly = false;
    });
    
    // İlk inputa focus ver
    setTimeout(() => {
        inputs[0].focus();
    }, 100);
}

// Kullanıcı İşlemleri
function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('register-username').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;

    const users = getUsers();
    if (users.find(u => u.username === username || u.email === email)) {
        showNotification('Bu kullanıcı adı veya e-posta zaten kayıtlı!', 'error');
        return;
    }

    users.push({ username, email, password });
    setUsers(users);
    showNotification('Kayıt başarılı! Giriş yapabilirsiniz.');
    showLoginForm();
}

function handleLogin(e) {
    e.preventDefault();
    const identifier = document.getElementById('login-identifier').value.trim();
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const user = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password);

    if (!user) {
        showNotification('Kullanıcı adı/e-posta veya şifre hatalı!', 'error');
        return;
    }

    currentUser = user;
    setCurrentUser(user);
    showMainScreen();
}

// Ana Ekran İşlemleri
function showMainScreen() {
    authContainer.classList.add('d-none');
    mainContainer.classList.remove('d-none');
    renderProducts(currentCategory);
    updateCartCount();
    accountBtn.classList.remove('d-none');
}

// Arama kutusu ile ürünleri filtrele
const searchInput = document.getElementById('search-input');
let searchQuery = '';
if (searchInput) {
    searchInput.addEventListener('input', function() {
        searchQuery = this.value.toLowerCase();
        renderProducts(currentCategory);
    });
}

function renderProducts(category) {
    currentCategory = category;
    let products = PRODUCTS[category];
    if (searchQuery) {
        products = products.filter(p => p.name.toLowerCase().includes(searchQuery));
    }
    productsSection.innerHTML = products.length === 0 ? '<div class="text-center text-muted">Ürün bulunamadı.</div>' : products.map(product => `
        <div class="col-md-4 mb-4">
            <div class="card h-100">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg width=\'300\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'><rect width=\'100%\' height=\'100%\' fill=\'#eee\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'#aaa\' font-size=\'20\'>Görsel Yok</text></svg>'">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.price} TL</p>
                    <button class="btn btn-primary" onclick="addToCart(${product.id})">Sepete Ekle</button>
                </div>
            </div>
        </div>
    `).join('');
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === category);
    });
}

// Sepet İşlemleri
function addToCart(productId) {
    const product = PRODUCTS[currentCategory].find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    
    updateCartCount();
    showNotification('Ürün sepete eklendi!');
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

function renderCart() {
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center">Sepetiniz boş.</p>';
        return;
    }
    const table = document.createElement('table');
    table.className = 'table table-borderless align-middle';
    table.innerHTML = `
        <thead>
            <tr>
                <th>Görsel</th>
                <th>Ürün</th>
                <th>Fiyat</th>
                <th style="width:180px;">Miktar</th>
                <th>Toplam</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            ${cart.map(item => `
                <tr>
                    <td><img src="${item.image}" alt="${item.name}" style="width:56px;height:56px;object-fit:cover;border-radius:8px;" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg width=\'56\' height=\'56\' xmlns=\'http://www.w3.org/2000/svg\'><rect width=\'100%\' height=\'100%\' fill=\'#eee\'/><text x=\'50%\' y=\'50%\' dominant-baseline=\'middle\' text-anchor=\'middle\' fill=\'#aaa\' font-size=\'10\'>Yok</text></svg>'"></td>
                    <td style="min-width:120px;">${item.name}</td>
                    <td>${item.price} TL</td>
                    <td>
                        <div class="d-flex align-items-center justify-content-center gap-2">
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="mx-2 fw-bold" style="min-width:32px;display:inline-block;text-align:center;">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                    </td>
                    <td>${item.price * item.quantity} TL</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">Sil</button>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    cartItems.appendChild(table);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartItems.innerHTML += `
        <hr>
        <div class="d-flex justify-content-between px-2">
            <h5>Toplam:</h5>
            <h5>${total} TL</h5>
        </div>
    `;
}

// Sepet İşlemleri için Global Fonksiyonlar
window.updateQuantity = function(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, item.quantity + change);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            renderCart();
        }
    }
};

window.setQuantity = function(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            renderCart();
        }
    }
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
};

// Event Listeners
showRegister.addEventListener('click', (e) => {
    e.preventDefault();
    showRegisterForm();
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    showLoginForm();
});

registerForm.addEventListener('submit', handleRegister);
loginForm.addEventListener('submit', handleLogin);

cartBtn.addEventListener('click', () => {
    renderCart();
    cartModal.show();
});

checkoutBtn.addEventListener('click', () => {
    cartModal.hide();
    showPaymentScreen();
});

// Kategori butonları
document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        renderProducts(btn.dataset.category);
    });
});

// Kart tipi ve banka tespiti (ilk 4 hane ile)
function detectCardType(number) {
    const clean = number.replace(/\D/g, '');
    const bins = [
        { name: 'Papara', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Papara_logo.svg', color: 'linear-gradient(135deg, #6e1e7b 0%, #e6007a 100%)', bins: ['6362'] },
        { name: 'Garanti', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Garanti_Bankas%C4%B1_logo.svg', color: 'linear-gradient(135deg, #009b5e 0%, #00c389 100%)', bins: ['6273', '5892'] },
        { name: 'DenizBank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/DenizBank_logo.svg', color: 'linear-gradient(135deg, #005baa 0%, #00c6fb 100%)', bins: ['6762', '5526'] },
        { name: 'Yapı Kredi', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Yap%C4%B1_Kredi_logo.svg', color: 'linear-gradient(135deg, #1e2a78 0%, #6a82fb 100%)', bins: ['4506', '5528'] },
        { name: 'Halkbank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Halkbank_logo.svg', color: 'linear-gradient(135deg, #005ca9 0%, #00b4db 100%)', bins: ['9792'] },
        { name: 'Ziraat', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Ziraat_Bankas%C4%B1_logo.svg', color: 'linear-gradient(135deg, #e30613 0%, #ff5858 100%)', bins: ['4766'] },
        { name: 'Akbank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Akbank_logo.svg', color: 'linear-gradient(135deg, #e60012 0%, #ff5858 100%)', bins: ['5571'] },
        { name: 'İş Bankası', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/T%C3%BCrkiye_%C4%B0%C5%9F_Bankas%C4%B1_logo.svg', color: 'linear-gradient(135deg, #003366 0%, #4f8edc 100%)', bins: ['4543'] },
        { name: 'QNB Finans', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/QNB_Finansbank_logo.svg', color: 'linear-gradient(135deg, #3a185b 0%, #6a3093 100%)', bins: ['5311'] },
        { name: 'VakıfBank', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Vak%C4%B1fBank_logo.svg', color: 'linear-gradient(135deg, #ffb300 0%, #ffdf00 100%)', bins: ['4157', '4508'] },
        { name: 'Mastercard', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Mastercard-logo.png', color: 'linear-gradient(135deg, #ff9800 0%, #ff3c3c 100%)', bins: ['5'] },
        { name: 'Visa', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png', color: 'linear-gradient(135deg, #1a2980 0%, #26d0ce 100%)', bins: ['4'] },
    ];
    if (clean.length < 1) return null;
    for (const b of bins) {
        for (const bin of b.bins) {
            if (clean.startsWith(bin)) return b;
        }
    }
    return null;
}

// Ödeme Ekranı
function showPaymentScreen() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    paymentSection.innerHTML = `
        <div class="text-center mb-4">
            <h4>Toplam Tutar: ${total} TL</h4>
        </div>
        <div id="card-visual"></div>
        <form id="payment-form">
            <div class="mb-3">
                <label class="form-label">Kart Numarası</label>
                <input type="text" class="form-control" id="card-number" maxlength="19" placeholder="**** **** **** 1234">
            </div>
            <div class="mb-3">
                <label class="form-label">Kart Sahibi</label>
                <input type="text" class="form-control" id="card-holder" maxlength="24" placeholder="**** ****">
            </div>
            <div class="row mb-3">
                <div class="col">
                    <label class="form-label">Son Kullanma Tarihi</label>
                    <input type="text" class="form-control" id="card-expiry" maxlength="5" placeholder="**/**">
                </div>
                <div class="col">
                    <label class="form-label">CVV</label>
                    <input type="text" class="form-control" id="card-cvv" maxlength="3" placeholder="***">
                </div>
            </div>
            <button type="submit" class="btn btn-primary w-100">Ödemeyi Tamamla</button>
        </form>
    `;
    // Kart görseli oluştur
    const cardVisual = document.getElementById('card-visual');
    cardVisual.innerHTML = `
        <div class="credit-card" id="credit-card">
            <div class="credit-card-front" id="credit-card-front">
                <div style="display:flex;align-items:center;justify-content:space-between;">
                    <div class="card-chip" id="card-chip"></div>
                    <img src="" id="card-logo" class="card-logo d-none" alt="logo">
                </div>
                <div class="card-number" id="visual-card-number">**** **** **** 1234</div>
                <div class="card-info-row">
                    <div>
                        <div class="card-label">Kart Sahibi</div>
                        <div class="card-holder" id="visual-card-holder">**** ****</div>
                    </div>
                    <div>
                        <div class="card-label">Son Kullanma</div>
                        <div class="card-expiry" id="visual-card-expiry">**/**</div>
                    </div>
                </div>
            </div>
            <div class="credit-card-back" id="credit-card-back">
                <div class="card-stripe"></div>
                <div style="margin-top:32px;"></div>
                <div class="card-cvv-label">CVV</div>
                <div class="card-cvv" id="visual-card-cvv">***</div>
            </div>
        </div>
    `;
    // Otomatik formatlama ve kart görselini güncelleme
    const cardNumber = document.getElementById('card-number');
    const cardHolder = document.getElementById('card-holder');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCVV = document.getElementById('card-cvv');
    const creditCard = document.getElementById('credit-card');
    const creditCardFront = document.getElementById('credit-card-front');
    const creditCardBack = document.getElementById('credit-card-back');
    const cardLogo = document.getElementById('card-logo');
    const cardChip = document.getElementById('card-chip');
    const visualCardNumber = document.getElementById('visual-card-number');
    const visualCardHolder = document.getElementById('visual-card-holder');
    const visualCardExpiry = document.getElementById('visual-card-expiry');
    const visualCardCVV = document.getElementById('visual-card-cvv');
    // Banka tasarım ayarları
    function applyBankDesign(detected) {
        if (!detected) {
            creditCard.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #e0e0e0 100%)';
            creditCardFront.style.boxShadow = '';
            creditCardFront.style.backgroundImage = '';
            return;
        }
        creditCard.style.background = detected.color;
        // Chip rengi ve desen
        if (detected.name === 'Ziraat') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #e30613 100%)';
            creditCardFront.style.boxShadow = '0 0 0 4px #e3061333';
        } else if (detected.name === 'Garanti') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #009b5e 100%)';
            creditCardFront.style.backgroundImage = 'url(https://svgshare.com/i/13kK.svg)'; // yeşil desen
            creditCardFront.style.backgroundSize = 'cover';
        } else if (detected.name === 'Papara') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #e6007a 100%)';
            creditCardFront.style.backgroundImage = 'url(https://svgshare.com/i/13kL.svg)'; // mor desen
            creditCardFront.style.backgroundSize = 'cover';
        } else if (detected.name === 'Akbank') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #e60012 100%)';
            creditCardFront.style.boxShadow = '0 0 0 4px #e6001233';
        } else if (detected.name === 'Halkbank') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #005ca9 100%)';
        } else if (detected.name === 'DenizBank') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #005baa 100%)';
        } else if (detected.name === 'Yapı Kredi') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #1e2a78 100%)';
        } else if (detected.name === 'İş Bankası') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #003366 100%)';
        } else if (detected.name === 'QNB Finans') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #3a185b 100%)';
        } else if (detected.name === 'VakıfBank') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #ffb300 100%)';
        } else if (detected.name === 'Mastercard') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #ff9800 100%)';
        } else if (detected.name === 'Visa') {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #1a2980 100%)';
        } else {
            cardChip.style.background = 'linear-gradient(90deg, #fff 0%, #e0e0e0 100%)';
            creditCardFront.style.boxShadow = '';
            creditCardFront.style.backgroundImage = '';
        }
    }
    cardNumber.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '').slice(0,16);
        value = value.replace(/(.{4})/g, '$1 ').trim();
        this.value = value;
        // Kart numarasını tek satırda 4'erli gruplar halinde ve yıldızlı göster
        let clean = value.replace(/\D/g, '');
        let display = '';
        for (let i = 0; i < 16; i++) {
            if (i < clean.length) {
                display += clean[i];
            } else {
                display += '*';
            }
            if ((i + 1) % 4 === 0 && i !== 15) display += ' ';
        }
        visualCardNumber.textContent = display;
        // Kart tipi ve banka tespiti
        const detected = detectCardType(this.value);
        if (detected) {
            cardLogo.src = detected.logo;
            cardLogo.classList.remove('d-none');
            cardLogo.alt = detected.name + ' logo';
            applyBankDesign(detected);
        } else {
            cardLogo.src = '';
            cardLogo.classList.add('d-none');
            cardLogo.alt = '';
            applyBankDesign(null);
        }
    });
    cardHolder.addEventListener('input', function(e) {
        let value = this.value.toUpperCase();
        visualCardHolder.textContent = value || '**** ****';
    });
    cardExpiry.addEventListener('input', function(e) {
        let value = this.value.replace(/[^0-9]/g, '').slice(0,4);
        if (value.length > 2) value = value.slice(0,2) + '/' + value.slice(2);
        this.value = value;
        visualCardExpiry.textContent = value || '**/**';
    });
    cardCVV.addEventListener('input', function(e) {
        this.value = this.value.replace(/\D/g, '').slice(0,3);
        let val = this.value;
        while (val.length < 3) val += '*';
        visualCardCVV.textContent = val;
    });
    // Kart animasyonu: CVV'ye odaklanınca kartı döndür
    cardCVV.addEventListener('focus', function() {
        creditCard.classList.add('flipped');
    });
    cardCVV.addEventListener('blur', function() {
        creditCard.classList.remove('flipped');
    });
    // Diğer alanlara odaklanınca ön yüze dön
    [cardNumber, cardHolder, cardExpiry].forEach(input => {
        input.addEventListener('focus', function() {
            creditCard.classList.remove('flipped');
        });
    });
    // Form submit
    document.getElementById('payment-form').addEventListener('submit', handlePayment);
    cartModal.hide();
    paymentModal.show();
}

function handlePayment(e) {
    e.preventDefault();
    // Test için her türlü girişte kabul
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const order = {
        id: Date.now(),
        date: new Date().toLocaleDateString('tr-TR'),
        total,
        items: cart.map(item => `${item.name} (x${item.quantity})`)
    };
    setTimeout(() => {
        paymentModal.hide();
        addOrderToHistory(order);
        cart = [];
        updateCartCount();
        showNotification('Ödeme başarıyla tamamlandı!');
    }, 1500);
}

// Çıkış Fonksiyonu
function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    mainContainer.classList.add('d-none');
    authContainer.classList.remove('d-none');
    showLoginForm();
    showNotification('Başarıyla çıkış yaptınız.', 'success');
}

document.getElementById('logout-btn').addEventListener('click', logout);

// Hesap modalı içeriğini doldur
function renderAccountInfo() {
    if (!currentUser) return;
    const orders = getOrderHistory();
    accountInfoSection.innerHTML = `
        <div class="mb-3">
            <strong>Kullanıcı Adı:</strong> ${currentUser.username}<br>
            <strong>E-posta:</strong> ${currentUser.email}
        </div>
        <div class="mb-2"><strong>Geçmiş Siparişler:</strong></div>
        <ul class="list-group mb-2">
            ${orders.length === 0 ? '<li class="list-group-item text-muted">Henüz siparişiniz yok.</li>' : orders.map(order => `
                <li class="list-group-item">
                    <div><b>#${order.id}</b> - ${order.date} - <b>${order.total} TL</b></div>
                    <div><small>${order.items.join(', ')}</small></div>
                </li>
            `).join('')}
        </ul>
    `;
}

accountBtn.addEventListener('click', () => {
    renderAccountInfo();
    accountModal.show();
});

accountLogoutBtn.addEventListener('click', () => {
    accountModal.hide();
    setTimeout(() => logout(), 400);
});

// Sepete Dön butonu
backToCartBtn.addEventListener('click', () => {
    paymentModal.hide();
    setTimeout(() => cartModal.show(), 400);
});

// Sayfa Yüklendiğinde
window.addEventListener('load', () => {
    currentUser = getCurrentUser();
    if (currentUser) {
        showMainScreen();
    }
});

// Sipariş geçmişi işlemleri
function getOrderHistory() {
    if (!currentUser) return [];
    const allOrders = JSON.parse(localStorage.getItem('orders') || '{}');
    return allOrders[currentUser.username] || [];
}

function addOrderToHistory(order) {
    if (!currentUser) return;
    const allOrders = JSON.parse(localStorage.getItem('orders') || '{}');
    if (!allOrders[currentUser.username]) allOrders[currentUser.username] = [];
    allOrders[currentUser.username].unshift(order); // son sipariş başa
    localStorage.setItem('orders', JSON.stringify(allOrders));
} 