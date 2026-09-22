let cart = [];

function openCart() {
  document.getElementById("cart").classList.add("active");
  document.getElementById("cartOverlay").classList.add("active");
}

function closeCart() {
  document.getElementById("cart").classList.remove("active");
  document.getElementById("cartOverlay").classList.remove("active");
}

function addToCart(name, price) {
  const existing = cart.find(product => product.name === name);
  if (existing) existing.quantity++;
  else cart.push({ name, price, quantity: 1 });
  updateCart();
  openCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cart-count");
  const cartTotal = document.getElementById("cartTotal");

  if (!cart.length) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <div>🛒</div>
        <h3>Seu carrinho está vazio</h3>
        <p>Escolha algo delicioso para começar.</p>
      </div>`;
    cartCount.textContent = "0";
    cartTotal.textContent = "R$ 0,00";
    return;
  }

  let total = 0;
  let quantityTotal = 0;
  cartItems.innerHTML = "";

  cart.forEach((product, index) => {
    total += product.price * product.quantity;
    quantityTotal += product.quantity;

    const item = document.createElement("div");
    item.style.cssText = "display:flex;justify-content:space-between;align-items:center;padding:15px 0;border-bottom:1px solid #eee;";
    item.innerHTML = `
      <div>
        <strong>${escapeHtml(product.name)}</strong>
        <div style="color:#777;margin-top:5px;font-size:13px;">
          R$ ${formatMoney(product.price)}
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:8px;">
        <button onclick="changeQuantity(${index},-1)" style="border:0;background:#eee;width:28px;height:28px;border-radius:50%;cursor:pointer;">−</button>
        <strong>${product.quantity}</strong>
        <button onclick="changeQuantity(${index},1)" style="border:0;background:#ff6500;color:white;width:28px;height:28px;border-radius:50%;cursor:pointer;">+</button>
      </div>`;
    cartItems.appendChild(item);
  });

  cartCount.textContent = quantityTotal;
  cartTotal.textContent = `R$ ${formatMoney(total)}`;
}

function changeQuantity(index, amount) {
  cart[index].quantity += amount;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  updateCart();
}

function checkout() {
  if (!cart.length) {
    alert("Seu carrinho está vazio.");
    return;
  }
  alert("Pedido recebido! 🍔\n\nObrigado por pedir no MANDOU BEM!");
}

function searchRestaurants() {
  const search = document.getElementById("searchInput").value.toLowerCase().trim();
  document.querySelectorAll(".restaurant-card").forEach(card => {
    const name = card.dataset.name.toLowerCase();
    const category = card.dataset.category.toLowerCase();
    card.style.display = !search || name.includes(search) || category.includes(search) ? "block" : "none";
  });
}

function filterCategory(category) {
  document.getElementById("searchInput").value = "";
  document.querySelectorAll(".restaurant-card").forEach(card => {
    card.style.display = card.dataset.category === category ? "block" : "none";
  });
  document.querySelector(".restaurants-section").scrollIntoView({ behavior: "smooth" });
}

function showAllRestaurants() {
  document.getElementById("searchInput").value = "";
  document.querySelectorAll(".restaurant-card").forEach(card => card.style.display = "block");
}

function formatMoney(value) {
  return value.toFixed(2).replace(".", ",");
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

updateCart();
