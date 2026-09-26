/* ==========================================================================
   CONFIG — edit these before you deploy
   ========================================================================== */
const CONFIG = {
  whatsappNumber: "911234567890",     // WhatsApp number, country code + number, no + or spaces
  cateringEmail: "hello@sriyancloudkitchen.example",
  currency: "₹",
};

/* ==========================================================================
   MENU DATA — edit dishes, prices and categories here
   ========================================================================== */
const MENU = [
  { id: "st1", category: "Starters", name: "Paneer Tikka", desc: "Char-grilled cottage cheese, smoked in a charcoal dum.", price: 189, veg: true },
  { id: "st2", category: "Starters", name: "Chicken 65", desc: "Curry-leaf tempered, fiery South Indian classic.", price: 219, veg: false },
  { id: "st3", category: "Starters", name: "Veg Spring Rolls", desc: "Crisp-fried, cabbage & carrot filling, chilli-garlic dip.", price: 149, veg: true },
  { id: "mn1", category: "Mains", name: "Butter Chicken", desc: "Tomato-cashew gravy, slow-simmered chicken.", price: 259, veg: false },
  { id: "mn2", category: "Mains", name: "Dal Makhani", desc: "Black lentils, overnight simmer, finished with cream.", price: 179, veg: true },
  { id: "mn3", category: "Mains", name: "Paneer Butter Masala", desc: "Cottage cheese in a mildly sweet tomato gravy.", price: 229, veg: true },
  { id: "mn4", category: "Mains", name: "Kadai Chicken", desc: "Bell pepper & onion, coarse-ground kadai masala.", price: 269, veg: false },
  { id: "br1", category: "Biryani & Rice", name: "Hyderabadi Chicken Biryani", desc: "Dum-cooked, served with raita and salan.", price: 249, veg: false },
  { id: "br2", category: "Biryani & Rice", name: "Veg Biryani", desc: "Seasonal vegetables, whole-spice dum rice.", price: 199, veg: true },
  { id: "br3", category: "Biryani & Rice", name: "Jeera Rice", desc: "Basmati rice, ghee-toasted cumin.", price: 99, veg: true },
  { id: "bd1", category: "Breads", name: "Butter Naan", desc: "Tandoor-fired, brushed with butter.", price: 45, veg: true },
  { id: "bd2", category: "Breads", name: "Garlic Naan", desc: "Tandoor-fired, fresh garlic and coriander.", price: 55, veg: true },
  { id: "bd3", category: "Breads", name: "Tandoori Roti", desc: "Whole wheat, cooked on the tandoor wall.", price: 30, veg: true },
  { id: "ds1", category: "Desserts", name: "Gulab Jamun (2 pc)", desc: "Milk-solid dumplings, cardamom sugar syrup.", price: 79, veg: true },
  { id: "ds2", category: "Desserts", name: "Rasmalai (2 pc)", desc: "Soft paneer discs, saffron-thickened milk.", price: 99, veg: true },
  { id: "bv1", category: "Beverages", name: "Masala Chai", desc: "Hand-crushed spice blend, simmered with milk.", price: 39, veg: true },
  { id: "bv2", category: "Beverages", name: "Sweet Lassi", desc: "Churned yoghurt, a little cream on top.", price: 69, veg: true },
  { id: "bv3", category: "Beverages", name: "Cold Coffee", desc: "Espresso, chilled milk, blended till frothy.", price: 89, veg: true },
];

const CATEGORIES = ["All", ...Array.from(new Set(MENU.map(i => i.category)))];

/* ==========================================================================
   CART — persisted in localStorage so a reload doesn't lose the order
   ========================================================================== */
const CART_KEY = "sriyan-cart-v1";
let cart = loadCart();
let activeFilter = "All";

function loadCart(){
  try{
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){
    return {};
  }
}

function saveCart(){
  try{ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
  catch(e){ /* storage unavailable — cart still works for this session */ }
}

function setQty(id, qty){
  if(qty <= 0){ delete cart[id]; }
  else { cart[id] = qty; }
  saveCart();
  renderOrderBar();
  syncQtyDisplays(id);
}

function getQty(id){ return cart[id] || 0; }

function itemLookup(id, name, price){
  const found = MENU.find(m => m.id === id);
  if(found) return found;
  return { id, name, price: Number(price) };
}

/* ==========================================================================
   RENDER: menu filters + grid
   ========================================================================== */
function renderFilters(){
  const el = document.getElementById("menuFilters");
  el.innerHTML = "";
  CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filter-btn" + (cat === activeFilter ? " active" : "");
    btn.textContent = cat;
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-selected", cat === activeFilter ? "true" : "false");
    btn.addEventListener("click", () => {
      activeFilter = cat;
      renderFilters();
      renderMenu();
    });
    el.appendChild(btn);
  });
}

function renderMenu(){
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";
  const items = MENU.filter(i => activeFilter === "All" || i.category === activeFilter);

  items.forEach(item => {
    const qty = getQty(item.id);
    const card = document.createElement("article");
    card.className = "menu-item";
    card.innerHTML = `
      <div class="menu-item-top">
        <p class="menu-item-name">${item.veg ? '<span class="veg-dot" aria-hidden="true"></span>' : ''}${escapeHtml(item.name)}</p>
        <span class="menu-item-price">${CONFIG.currency}${item.price}</span>
      </div>
      <p class="menu-item-desc">${escapeHtml(item.desc)}</p>
      <div class="menu-item-bottom">
        <div class="qty-stepper" data-id="${item.id}">
          <button type="button" class="qty-btn" data-action="dec" aria-label="Decrease quantity of ${escapeHtml(item.name)}">–</button>
          <span class="qty-value" data-qty>${qty}</span>
          <button type="button" class="qty-btn" data-action="inc" aria-label="Increase quantity of ${escapeHtml(item.name)}">+</button>
        </div>
        <button type="button" class="btn btn-primary add-to-order" data-id="${item.id}" data-name="${escapeAttr(item.name)}" data-price="${item.price}">
          Add
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  wireSteppers();
  wireAddButtons();
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[s]));
}
function escapeAttr(str){ return escapeHtml(str); }

/* ==========================================================================
   Steppers (hero card + every menu item share this behaviour)
   ========================================================================== */
function wireSteppers(){
  document.querySelectorAll(".qty-stepper").forEach(stepper => {
    const id = stepper.dataset.id;
    const valueEl = stepper.querySelector("[data-qty]");
    // reflect current cart qty, but keep a local "pending" qty of at least 1 for display before adding
    valueEl.textContent = getQty(id) > 0 ? getQty(id) : (stepper.dataset.pending || 1);

    stepper.querySelectorAll(".qty-btn").forEach(btn => {
      // avoid double-binding on re-render
      if(btn.dataset.bound) return;
      btn.dataset.bound = "1";
      btn.addEventListener("click", () => {
        const current = parseInt(valueEl.textContent, 10) || 1;
        const next = btn.dataset.action === "inc" ? current + 1 : Math.max(1, current - 1);
        valueEl.textContent = next;
        stepper.dataset.pending = next;
        // if this item is already in the cart, update the cart quantity live
        if(getQty(id) > 0){ setQty(id, next); }
      });
    });
  });
}

function syncQtyDisplays(id){
  document.querySelectorAll(`.qty-stepper[data-id="${cssEscape(id)}"] [data-qty]`).forEach(el => {
    el.textContent = getQty(id) > 0 ? getQty(id) : 1;
  });
}
function cssEscape(id){ return id.replace(/"/g, '\\"'); }

function wireAddButtons(){
  document.querySelectorAll(".add-to-order").forEach(btn => {
    if(btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      const stepper = document.querySelector(`.qty-stepper[data-id="${cssEscape(id)}"]`);
      const pending = stepper ? (parseInt(stepper.querySelector("[data-qty]").textContent, 10) || 1) : 1;
      const current = getQty(id);
      setQty(id, current + pending);
      flashAdded(btn);
      // reset the visible stepper back to 1 for the next add
      if(stepper){
        stepper.dataset.pending = 1;
        stepper.querySelector("[data-qty]").textContent = getQty(id);
      }
    });
  });
}

function flashAdded(btn){
  const original = btn.textContent;
  btn.textContent = "Added ✓";
  btn.disabled = true;
  setTimeout(() => { btn.textContent = original; btn.disabled = false; }, 900);
}

/* ==========================================================================
   Floating order bar + WhatsApp handoff
   ========================================================================== */
function renderOrderBar(){
  const bar = document.getElementById("orderBar");
  const countEl = document.getElementById("orderBarCount");
  const totalEl = document.getElementById("orderBarTotal");
  const cartCountEl = document.getElementById("cartCount");

  const entries = Object.entries(cart);
  const itemCount = entries.reduce((sum, [, qty]) => sum + qty, 0);
  const total = entries.reduce((sum, [id, qty]) => {
    const item = MENU.find(m => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  countEl.textContent = `${itemCount} item${itemCount === 1 ? "" : "s"}`;
  totalEl.textContent = `${CONFIG.currency}${total}`;
  cartCountEl.textContent = itemCount;

  bar.classList.toggle("visible", itemCount > 0);
}

function buildWhatsAppMessage(){
  const lines = ["Hi Sriyan Cloud Kitchen, I'd like to order:", ""];
  let total = 0;
  Object.entries(cart).forEach(([id, qty]) => {
    const item = MENU.find(m => m.id === id);
    if(!item) return;
    const lineTotal = item.price * qty;
    total += lineTotal;
    lines.push(`• ${item.name} x${qty} — ${CONFIG.currency}${lineTotal}`);
  });
  lines.push("", `Total: ${CONFIG.currency}${total}`, "", "Delivery address: ");
  return lines.join("\n");
}

document.getElementById("sendOrder").addEventListener("click", () => {
  if(Object.keys(cart).length === 0) return;
  const msg = encodeURIComponent(buildWhatsAppMessage());
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${msg}`, "_blank", "noopener");
});

document.getElementById("clearOrder").addEventListener("click", () => {
  cart = {};
  saveCart();
  renderOrderBar();
  renderMenu();
});

document.getElementById("cartPill").addEventListener("click", () => {
  document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
});

/* ==========================================================================
   Hero special card — same stepper/add pattern, wired after DOM ready below
   ========================================================================== */

/* ==========================================================================
   Mobile nav toggle
   ========================================================================== */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");
navToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});
mainNav.querySelectorAll("a").forEach(a => {
  a.addEventListener("click", () => {
    mainNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* ==========================================================================
   Catering form — validates, then hands off to email (no backend required)
   ========================================================================== */
const cateringForm = document.getElementById("cateringForm");
const cateringStatus = document.getElementById("cateringStatus");

cateringForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = cateringForm.name.value.trim();
  const phone = cateringForm.phone.value.trim();
  const guests = cateringForm.guests.value.trim();
  const date = cateringForm.date.value;
  const message = cateringForm.message.value.trim();

  if(!name || !phone || !guests || !date){
    cateringStatus.textContent = "Please fill in your name, phone, guest count and date.";
    cateringStatus.className = "form-status err";
    return;
  }
  if(!/^[0-9+\-\s]{7,15}$/.test(phone)){
    cateringStatus.textContent = "That phone number doesn't look right — please check it.";
    cateringStatus.className = "form-status err";
    return;
  }

  const subject = encodeURIComponent(`Catering enquiry — ${name}, ${guests} guests, ${date}`);
  const body = encodeURIComponent(
    `Name: ${name}\nPhone: ${phone}\nGuests: ${guests}\nDate: ${date}\n\n${message}`
  );
  window.location.href = `mailto:${CONFIG.cateringEmail}?subject=${subject}&body=${body}`;

  cateringStatus.textContent = "Opening your email app to send this enquiry — if nothing opens, WhatsApp us instead.";
  cateringStatus.className = "form-status ok";
});

/* ==========================================================================
   Init
   ========================================================================== */
document.getElementById("year").textContent = new Date().getFullYear();
renderFilters();
renderMenu();
renderOrderBar();
wireSteppers(); // hero special card stepper
wireAddButtons(); // hero special card add button
