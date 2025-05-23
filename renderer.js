// Kullanıcı verileri localStorage'da tutulacak
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}
function setUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Giriş yapan kullanıcıyı localStorage'da tut
function setCurrentUser(user) {
  localStorage.setItem('currentUser', JSON.stringify(user));
}
function getCurrentUser() {
  return JSON.parse(localStorage.getItem('currentUser'));
}
function clearCurrentUser() {
  localStorage.removeItem('currentUser');
}

// Ürünler (örnek)
const PRODUCTS = {
  elektronik: [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Kulaklık' },
    { id: 3, name: 'Akıllı Telefon' }
  ],
  kitap: [
    { id: 4, name: 'Roman' },
    { id: 5, name: 'Bilim Kitabı' },
    { id: 6, name: 'Çizgi Roman' }
  ],
  giyim: [
    { id: 7, name: 'Tişört' },
    { id: 8, name: 'Pantolon' },
    { id: 9, name: 'Ceket' }
  ]
};

let cart = {};
let currentCategory = 'elektronik';

// Formlar arası geçiş
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');
const authSection = document.getElementById('auth-section');
const mainSection = document.getElementById('main-section');
const registerCard = document.getElementById('register-card');

function cleanAllOverlaysAndFocus() {
  // Tüm SweetAlert2, modal, overlay ve body classlarını temizle
  document.querySelectorAll('.swal2-container, .modal-backdrop, .swal2-shown, .swal2-height-auto').forEach(el => el.remove());
  document.body.classList.remove('swal2-shown', 'swal2-height-auto');
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  // Inputa focus'u iki kez ver
  const input = document.getElementById('login-identifier');
  if (input) {
    input.disabled = false;
    input.readOnly = false;
    input.blur();
    input.focus();
    setTimeout(() => {
      input.blur();
      input.focus();
    }, 200);
  }
}

showRegister.addEventListener('click', () => {
  loginForm.parentElement.parentElement.classList.add('d-none');
  registerCard.classList.remove('d-none');
  setTimeout(cleanAllOverlaysAndFocus, 50);
});
showLogin.addEventListener('click', () => {
  registerCard.classList.add('d-none');
  loginForm.parentElement.parentElement.classList.remove('d-none');
  loginForm.reset();
  document.getElementById('login-identifier').disabled = false;
  document.getElementById('login-identifier').readOnly = false;
  document.getElementById('login-password').disabled = false;
  document.getElementById('login-password').readOnly = false;
  setTimeout(cleanAllOverlaysAndFocus, 50);
});

// Kayıt
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('register-username').value.trim();
  const email = document.getElementById('register-email').value.trim();
  const password = document.getElementById('register-password').value;
  let users = getUsers();
  if (users.find(u => u.username === username || u.email === email)) {
    setTimeout(() => {
      alert('Bu kullanıcı adı veya e-posta zaten kayıtlı!');
      cleanAllOverlaysAndFocus();
    }, 100);
    return;
  }
  const user = { username, email, password };
  users.push(user);
  setUsers(users);
  setTimeout(() => {
    alert('Kayıt başarılı! Giriş yapabilirsiniz.');
    registerCard.classList.add('d-none');
    loginForm.parentElement.parentElement.classList.remove('d-none');
    loginForm.reset();
    document.getElementById('login-identifier').disabled = false;
    document.getElementById('login-identifier').readOnly = false;
    document.getElementById('login-password').disabled = false;
    document.getElementById('login-password').readOnly = false;
    cleanAllOverlaysAndFocus();
  }, 100);
});

// Giriş
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const identifier = document.getElementById('login-identifier').value.trim();
  const password = document.getElementById('login-password').value;
  const users = getUsers();
  const user = users.find(u => (u.username === identifier || u.email === identifier) && u.password === password);
  if (!user) {
    setTimeout(() => {
      alert('Kullanıcı adı/e-posta veya şifre hatalı!');
      cleanAllOverlaysAndFocus();
    }, 100);
    return;
  }
  setCurrentUser(user);
  showMainScreen();
});

function showMainScreen() {
  authSection.classList.add('d-none');
  mainSection.classList.remove('d-none');
  renderProducts(currentCategory);
  updateCartCount();
}

// Kategori butonları
Array.from(document.getElementsByClassName('category-btn')).forEach(btn => {
  btn.addEventListener('click', function() {
    currentCategory = this.dataset.category;
    renderProducts(currentCategory);
  });
});

// Ürünleri göster
function renderProducts(category) {
  const section = document.getElementById('products-section');
  section.innerHTML = '';
  PRODUCTS[category].forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.innerHTML = `
      <div class="card h-100">
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title">${product.name}</h5>
          <button class="btn btn-outline-success mt-3 add-to-cart" data-id="${product.id}" data-name="${product.name}">Sepete Ekle</button>
        </div>
      </div>
    `;
    section.appendChild(col);
  });
  Array.from(document.getElementsByClassName('add-to-cart')).forEach(btn => {
    btn.addEventListener('click', function() {
      addToCart(this.dataset.id, this.dataset.name);
    });
  });
}

// Sepet işlemleri
function addToCart(id, name) {
  if (!cart[id]) {
    cart[id] = { name, quantity: 1 };
  } else {
    cart[id].quantity++;
  }
  updateCartCount();
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = Object.keys(cart).reduce((sum, id) => sum + cart[id].quantity, 0);
}

document.getElementById('cart-btn').addEventListener('click', () => {
  renderCart();
  new bootstrap.Modal(document.getElementById('cartModal')).show();
});

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  if (Object.keys(cart).length === 0) {
    cartItems.innerHTML = '<p>Sepetiniz boş.</p>';
    return;
  }
  const table = document.createElement('table');
  table.className = 'table';
  table.innerHTML = `
    <thead><tr><th>Ürün</th><th>Miktar</th><th></th></tr></thead>
    <tbody>
      ${Object.entries(cart).map(([id, item]) => `
        <tr>
          <td>${item.name}</td>
          <td>
            <button class="btn btn-sm btn-secondary me-1" onclick="window.changeQty('${id}', -1)">-</button>
            <input type="number" min="1" value="${item.quantity}" style="width:60px;display:inline-block;" onchange="window.setQty('${id}', this.value)">
            <button class="btn btn-sm btn-secondary ms-1" onclick="window.changeQty('${id}', 1)">+</button>
          </td>
          <td><button class="btn btn-sm btn-danger" onclick="window.removeFromCart('${id}')">Sil</button></td>
        </tr>
      `).join('')}
    </tbody>
  `;
  cartItems.appendChild(table);
}

window.changeQty = function(id, delta) {
  if (cart[id]) {
    cart[id].quantity += delta;
    if (cart[id].quantity < 1) cart[id].quantity = 1;
    renderCart();
    updateCartCount();
  }
};
window.setQty = function(id, value) {
  const qty = parseInt(value);
  if (cart[id] && qty > 0) {
    cart[id].quantity = qty;
    renderCart();
    updateCartCount();
  }
};
window.removeFromCart = function(id) {
  delete cart[id];
  renderCart();
  updateCartCount();
};

document.getElementById('checkout-btn').addEventListener('click', () => {
  new bootstrap.Modal(document.getElementById('cartModal')).hide();
  showPaymentScreen();
});

function showPaymentScreen() {
  const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
  document.getElementById('payment-section').innerHTML = `
    <h5>Ödeme ekranı buraya gelecek.</h5>
    <p>Sepetinizde ${Object.keys(cart).length} ürün var.</p>
    <button class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
  `;
  paymentModal.show();
}

// Otomatik giriş (refresh sonrası)
window.onload = function() {
  if (getCurrentUser()) {
    showMainScreen();
  }
}; 