const state = {
  data: null,
  mode: "retail",
  search: "",
  range: "",
  status: "",
  needsOrderOnly: false,
  cart: JSON.parse(localStorage.getItem("freshFaceStockCart") || "[]")
};

const $ = (selector) => document.querySelector(selector);

document.addEventListener("DOMContentLoaded", init);

async function init() {
  try {
    const response = await fetch("data/products.json", { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load data/products.json (${response.status})`);
    state.data = await response.json();
    validateData();
    document.title = `${state.data.businessName || "Stock"} — Stock Manager`;
    $("#businessName").textContent = state.data.businessName || "Stock Manager";
    populateRanges();
    bindEvents();
    render();
  } catch (error) {
    $("#dataNotice").hidden = false;
    $("#dataNotice").textContent =
      "The product data could not be loaded. If you opened index.html directly, run the site with a small local server (for example: python -m http.server 8000) and open the address shown in your terminal.";
    console.error(error);
  }
}

function validateData() {
  const allowed = new Set(state.data.statuses || ["In Stock", "Running Low", "Out of Stock"]);
  const problems = [];
  for (const p of state.data.products || []) {
    for (const mode of ["retail", "professional"]) {
      const item = p[mode];
      if (!item) problems.push(`${p.name}: missing ${mode} data`);
      if (item && item.status && !allowed.has(item.status)) problems.push(`${p.name}: invalid ${mode} status`);
    }
  }
  if (problems.length) {
    $("#dataNotice").hidden = false;
    $("#dataNotice").textContent = `Data check: ${problems.slice(0, 2).join(" • ")}${problems.length > 2 ? " • …" : ""}`;
  }
}

function bindEvents() {
  document.querySelectorAll(".mode").forEach(btn => {
    btn.addEventListener("click", () => {
      state.mode = btn.dataset.mode;
      document.querySelectorAll(".mode").forEach(b => b.classList.toggle("active", b === btn));
      render();
    });
  });
  $("#search").addEventListener("input", e => { state.search = e.target.value.trim().toLowerCase(); renderProducts(); });
  $("#rangeFilter").addEventListener("change", e => { state.range = e.target.value; renderProducts(); });
  $("#statusFilter").addEventListener("change", e => { state.status = e.target.value; renderProducts(); });
  $("#needsOrderOnly").addEventListener("change", e => { state.needsOrderOnly = e.target.checked; renderProducts(); });

  $("#openCartBtn").addEventListener("click", openCart);
  $("#closeCartBtn").addEventListener("click", closeCart);
  $("#drawerBackdrop").addEventListener("click", closeCart);
  $("#checkoutModal").addEventListener("click", e => {
    if (e.target === $("#checkoutModal")) $("#checkoutModal").close();
  });
  $("#closeCheckoutBtn").addEventListener("click", () => $("#checkoutModal").close());
  $("#copyOrderBtn").addEventListener("click", copyOrder);
  $("#downloadOrderBtn").addEventListener("click", downloadOrder);
  $("#openGuideBtn").addEventListener("click", () => $("#guideModal").showModal());
  $("#closeGuideBtn").addEventListener("click", () => $("#guideModal").close());

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeCart();
  });
}

function populateRanges() {
  const ranges = [...new Set(state.data.products.flatMap(p => p.ranges || []))].sort();
  $("#rangeFilter").innerHTML = '<option value="">All ranges</option>' +
    ranges.map(r => `<option value="${escapeAttr(r)}">${escapeHtml(r)}</option>`).join("");
}

function render() {
  renderStats();
  renderProducts();
  renderCart();
}

function renderStats() {
  const mode = state.mode;
  const products = state.data.products;
  const stockedProducts = products.filter(p => hasSellableMode(p, mode));
  const low = stockedProducts.filter(p => p[mode].status === "Running Low" && !p[mode].specialOrder).length;
  const out = stockedProducts.filter(p => p[mode].status === "Out of Stock" && !p[mode].specialOrder).length;
  const special = products.filter(p => p[mode].specialOrder).length;
  const cartUnits = state.cart.reduce((sum, x) => sum + x.quantity, 0);

  $("#stats").innerHTML = [
    stat("Products", stockedProducts.length, `${capitalize(mode)} catalogue`),
    stat("Running low", low, "Needs attention"),
    stat("Out of stock", out, "Excludes special-order items"),
    stat("Basket", cartUnits, "Units currently selected")
  ].join("");
}

function stat(label, value, note) {
  return `<div class="stat"><span class="stat-label">${label}</span><strong class="stat-value">${value}</strong><div class="stat-note">${note}</div></div>`;
}

function filteredProducts() {
  const mode = state.mode;
  return state.data.products.filter(p => {
    const item = p[mode];
    const haystack = `${p.name} ${(p.ranges || []).join(" ")}`.toLowerCase();
    if (state.search && !haystack.includes(state.search)) return false;
    if (state.range && !(p.ranges || []).includes(state.range)) return false;
    if (state.status && item.status !== state.status) return false;
    if (state.needsOrderOnly && !needsOrder(p, mode)) return false;
    return true;
  });
}

function renderProducts() {
  const products = filteredProducts();
  $("#resultCount").textContent = `${products.length} product${products.length === 1 ? "" : "s"}`;
  $("#resultsHeading").textContent = state.search || state.range || state.status || state.needsOrderOnly
    ? "Filtered products" : `${capitalize(state.mode)} products`;
  $("#emptyState").hidden = products.length !== 0;
  $("#productRows").innerHTML = products.map(productRow).join("");
  $("#productRows").querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => addToCart(btn.dataset.add));
  });
}

function productRow(p) {
  const item = p[state.mode];
  const status = effectiveStatus(p, state.mode);
  const disabled = item.price == null;
  const image = p.image ? `<img class="product-image" src="${escapeAttr(p.image)}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">` : "";
  const initial = `<span class="product-image product-initial" ${p.image ? 'style="display:none"' : ''}>${escapeHtml(initials(p.name))}</span>`;
  const specialText = item.specialOrder ? "Special order • not kept on hand" : `${item.quantity ?? 0} unit${(item.quantity ?? 0) === 1 ? "" : "s"} recorded`;
  return `<tr>
    <td>
      <div class="product-name">
        ${image}${initial}
        <div><div class="name-text">${escapeHtml(p.name)}</div><div class="subtext">${escapeHtml(specialText)}</div></div>
      </div>
    </td>
    <td><div class="range-list">${(p.ranges || []).map(r => `<span class="range-pill">${escapeHtml(r)}</span>`).join("")}</div></td>
    <td>${item.size ? escapeHtml(item.size) : '<span class="no-price">—</span>'}</td>
    <td><div class="stock-wrap"><span class="status ${statusClass(status)}">${escapeHtml(status)}</span>${item.specialOrder ? '<span class="special">Special order</span>' : ''}</div></td>
    <td class="price">${formatPrice(item.price)}</td>
    <td><button class="add-button" data-add="${escapeAttr(p.id)}" ${disabled ? "disabled" : ""}>${disabled ? "No price" : "Add to basket"}</button></td>
  </tr>`;
}

function effectiveStatus(product, mode) {
  const item = product[mode];
  if (item.specialOrder && Number(item.quantity || 0) === 0) return "Special Order";
  return item.status || "In Stock";
}

function statusClass(status) {
  if (status === "Running Low") return "low";
  if (status === "Out of Stock") return "out";
  return "in";
}

function needsOrder(product, mode) {
  const item = product[mode];
  if (item.specialOrder) return false;
  return item.status === "Running Low" || item.status === "Out of Stock";
}

function hasSellableMode(product, mode) {
  return product[mode] && product[mode].price != null;
}

function addToCart(id) {
  const product = state.data.products.find(p => p.id === id);
  if (!product) return;
  const item = product[state.mode];
  if (item.price == null) return;
  const key = `${id}__${state.mode}`;
  const existing = state.cart.find(x => x.key === key);
  if (existing) existing.quantity += 1;
  else state.cart.push({ key, productId:id, mode:state.mode, quantity:1 });
  saveCart();
  render();
  openCart();
}

function renderCart() {
  const body = $("#cartBody");
  if (!state.cart.length) {
    body.innerHTML = `<div class="cart-empty"><h3>Your basket is empty</h3><p>Add retail or professional products from the stock list.</p></div>`;
    $("#cartFooter").innerHTML = "";
    $("#cartCount").textContent = "0";
    return;
  }

  let total = 0;
  body.innerHTML = state.cart.map((line, index) => {
    const p = state.data.products.find(x => x.id === line.productId);
    if (!p) return "";
    const item = p[line.mode];
    const lineTotal = Number(item.price) * line.quantity;
    total += lineTotal;
    return `<div class="cart-item">
      <div>
        <div class="cart-item-name">${escapeHtml(p.name)}</div>
        <div class="cart-item-meta">${capitalize(line.mode)} • ${escapeHtml(item.size || "Standard")} • ${formatPrice(item.price)} each</div>
        <div class="cart-item-controls">
          <button class="qty-button" data-minus="${index}" type="button">−</button>
          <span class="qty-value">${line.quantity}</span>
          <button class="qty-button" data-plus="${index}" type="button">+</button>
          <button class="remove-link" data-remove="${index}" type="button">Remove</button>
        </div>
      </div>
      <div class="cart-line-total">${formatPrice(lineTotal)}</div>
    </div>`;
  }).join("");

  body.querySelectorAll("[data-minus]").forEach(b => b.onclick = () => changeCart(Number(b.dataset.minus), -1));
  body.querySelectorAll("[data-plus]").forEach(b => b.onclick = () => changeCart(Number(b.dataset.plus), 1));
  body.querySelectorAll("[data-remove]").forEach(b => b.onclick = () => removeCart(Number(b.dataset.remove)));

  const units = state.cart.reduce((sum, x) => sum + x.quantity, 0);
  $("#cartCount").textContent = units;
  $("#cartFooter").innerHTML = `<div class="total-row"><span>Order total</span><strong>${formatPrice(total)}</strong></div>
    <button class="primary-button checkout-full" id="checkoutBtn" type="button">Create order</button>
    <p class="footer-note">The basket does not place an order online. It creates your supplier order message.</p>`;
  $("#checkoutBtn").onclick = openCheckout;
}

function changeCart(index, delta) {
  const line = state.cart[index];
  if (!line) return;
  line.quantity += delta;
  if (line.quantity <= 0) state.cart.splice(index, 1);
  saveCart(); render();
}

function removeCart(index) {
  state.cart.splice(index, 1);
  saveCart(); render();
}

function saveCart() {
  localStorage.setItem("freshFaceStockCart", JSON.stringify(state.cart));
}

function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#cartDrawer").setAttribute("aria-hidden", "false");
  $("#drawerBackdrop").hidden = false;
  document.body.style.overflow = "hidden";
}
function closeCart() {
  $("#cartDrawer").classList.remove("open");
  $("#cartDrawer").setAttribute("aria-hidden", "true");
  $("#drawerBackdrop").hidden = true;
  document.body.style.overflow = "";
}

function openCheckout() {
  const text = buildOrderText();
  $("#orderText").value = text;
  $("#copyFeedback").textContent = "";
  $("#checkoutModal").showModal();
}

function buildOrderText() {
  const lines = [];
  const now = new Date().toLocaleDateString("en-GB", { day:"2-digit", month:"long", year:"numeric" });
  lines.push(`Subject: ${state.data.emailSubjectPrefix || "Stock Order"} — ${now}`);
  lines.push("");
  lines.push(`Hello,`);
  lines.push("");
  lines.push(`Please could I place the following stock order?`);
  lines.push("");
  lines.push("PRODUCT | TYPE | PACK SIZE | QTY | UNIT PRICE | LINE TOTAL");
  lines.push("----------------------------------------------------------------");
  let total = 0;
  for (const line of state.cart) {
    const p = state.data.products.find(x => x.id === line.productId);
    if (!p) continue;
    const item = p[line.mode];
    const lineTotal = Number(item.price) * line.quantity;
    total += lineTotal;
    lines.push(`${p.name} | ${capitalize(line.mode)} | ${item.size || "Standard"} | ${line.quantity} | ${formatPrice(item.price)} | ${formatPrice(lineTotal)}`);
  }
  lines.push("----------------------------------------------------------------");
  lines.push(`TOTAL: ${formatPrice(total)}`);
  lines.push("");
  lines.push("Please confirm availability and expected delivery.");
  lines.push("");
  lines.push("Many thanks,");
  return lines.join("\n");
}

async function copyOrder() {
  const text = $("#orderText").value;
  try {
    await navigator.clipboard.writeText(text);
    $("#copyFeedback").textContent = "Order text copied.";
  } catch {
    $("#orderText").select();
    document.execCommand("copy");
    $("#copyFeedback").textContent = "Order text copied.";
  }
}

function downloadOrder() {
  const blob = new Blob([$("#orderText").value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `stock-order-${new Date().toISOString().slice(0,10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function formatPrice(price) {
  if (price == null || price === "") return "—";
  return new Intl.NumberFormat("en-GB", { style:"currency", currency:state.data?.currency || "GBP" }).format(Number(price));
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function initials(name) {
  return name.split(/\s+/).slice(0,2).map(x => x[0]).join("").toUpperCase();
}
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}
function escapeAttr(value) { return escapeHtml(value); }
