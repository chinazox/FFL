const state = {
  data: null,
  products: [],
  cart: JSON.parse(localStorage.getItem("freshFaceStockCart") || "{}")
};

const $ = (sel) => document.querySelector(sel);
const money = (value) => value == null ? "Price not set" : new Intl.NumberFormat("en-GB", {style:"currency", currency: state.data?.currency || "GBP"}).format(value);
const statusLabel = {in_stock:"In stock", running_low:"Running low", out_of_stock:"Out of stock"};

async function init(){
  try{
    const res = await fetch("products.json", {cache:"no-store"});
    if(!res.ok) throw new Error("Could not load products.json");
    state.data = await res.json();
    state.products = state.data.products || [];
    $("#businessName").textContent = state.data.businessName || "Stock Manager";
    populateRanges();
    render();
  }catch(err){
    console.error(err);
    $("#productGrid").innerHTML = `<div class="notice"><strong>Could not load products.json.</strong><span>Check that the site is being served from a web server (e.g. GitHub Pages, Netlify, or a local server).</span></div>`;
  }
}

function populateRanges(){
  const ranges = [...new Set(state.products.flatMap(p => p.range || []))].sort((a,b)=>a.localeCompare(b));
  $("#rangeFilter").innerHTML = `<option value="all">All ranges</option>` + ranges.map(r=>`<option value="${esc(r)}">${esc(r)}</option>`).join("");
}

function filteredProducts(){
  const q = $("#search").value.trim().toLowerCase();
  const range = $("#rangeFilter").value;
  const status = $("#statusFilter").value;
  const specialOnly = $("#specialFilter").checked;
  return state.products.filter(p => {
    const text = `${p.name} ${(p.range||[]).join(" ")} ${p.size||""}`.toLowerCase();
    return (!q || text.includes(q))
      && (range === "all" || (p.range||[]).includes(range))
      && (status === "all" || p.status === status)
      && (!specialOnly || p.specialOrder);
  });
}

function render(){
  renderStats();
  renderAttention();
  const products = filteredProducts();
  $("#productGrid").innerHTML = products.map(productCard).join("");
  $("#emptyState").hidden = products.length !== 0;
  updateCartUI();
}

function renderStats(){
  const regular = state.products.filter(p=>!p.specialOrder);
  const low = regular.filter(p=>p.status==="running_low").length;
  const out = regular.filter(p=>p.status==="out_of_stock").length;
  const inStock = regular.filter(p=>p.status==="in_stock").length;
  const special = state.products.filter(p=>p.specialOrder).length;
  $("#stats").innerHTML = [
    ["Total", state.products.length],
    ["In stock", inStock],
    ["Running low", low],
    ["Out of stock", out],
    ["Special order", special]
  ].map(([label,n])=>`<div class="stat"><strong>${n}</strong><span>${label}</span></div>`).join("");
}

function renderAttention(){
  const low = state.products.filter(p=>!p.specialOrder && p.status==="running_low");
  const out = state.products.filter(p=>!p.specialOrder && p.status==="out_of_stock");
  if(!low.length && !out.length){ $("#attention").innerHTML=""; return; }
  const parts = [];
  if(low.length) parts.push(`<strong>${low.length} running low</strong>`);
  if(out.length) parts.push(`<strong>${out.length} out of stock</strong>`);
  $("#attention").innerHTML = `<div class="notice"><span>Stock attention: ${parts.join(" · ")}. Special-order items are excluded from this alert.</span><button class="text-button" onclick="focusAttention()">View</button></div>`;
}

function focusAttention(){
  $("#statusFilter").value = "running_low";
  render();
  window.scrollTo({top:document.querySelector(".product-grid").offsetTop-100, behavior:"smooth"});
}

function productCard(p){
  const qty = Number(state.cart[p.id] || 0);
  const unavailable = p.price == null;
  const inCartClass = qty ? "in-cart" : "";
  return `<article class="product ${inCartClass}">
    <div class="product-image">${p.image ? `<img src="${escAttr(p.image)}" alt="">` : `<span>Product image</span>`}</div>
    <div class="product-body">
      <div class="product-top">
        <h3>${esc(p.name)}</h3>
        <span class="badge ${p.status}">${statusLabel[p.status] || p.status}</span>
      </div>
      ${p.specialOrder ? `<span class="special">Special order</span>` : ""}
      <div class="meta">${esc((p.range||[]).join(" · "))}<br>${esc(p.size || "")}</div>
      <div class="price">${money(p.price)}</div>
      <div class="product-actions">
        <button class="add" ${unavailable ? "disabled" : ""} onclick="addToCart('${p.id}')">${unavailable ? "Price needed" : "Add to order"}</button>
        <div class="qty-control">
          <button onclick="changeQty('${p.id}',-1)" aria-label="Decrease quantity">−</button>
          <span>${qty}</span>
          <button onclick="changeQty('${p.id}',1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
    </div>
  </article>`;
}

function addToCart(id){ changeQty(id,1); openCart(); }
function changeQty(id, delta){
  state.cart[id] = Math.max(0, Number(state.cart[id] || 0) + delta);
  if(!state.cart[id]) delete state.cart[id];
  localStorage.setItem("freshFaceStockCart", JSON.stringify(state.cart));
  render();
}
function cartItems(){
  return Object.entries(state.cart).map(([id,qty]) => ({product:state.products.find(p=>p.id===id), qty})).filter(x=>x.product);
}
function cartTotal(){ return cartItems().reduce((sum,x)=>sum + (x.product.price || 0) * x.qty, 0); }

function updateCartUI(){
  const items = cartItems();
  const count = items.reduce((n,x)=>n+x.qty,0);
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = money(cartTotal());
  if(!items.length){
    $("#cartItems").innerHTML = `<p class="muted">Your order basket is empty. Add products from the stock list.</p>`;
    return;
  }
  $("#cartItems").innerHTML = items.map(({product:p,qty})=>`
    <div class="cart-row">
      <div><div class="cart-name">${esc(p.name)}</div><div class="cart-meta">${esc(p.size||"")}${p.specialOrder ? " · Special order" : ""}</div></div>
      <div class="cart-right">
        <div class="cart-price">${money((p.price||0)*qty)}</div>
        <div class="mini-qty"><button onclick="changeQty('${p.id}',-1)">−</button><span>${qty}</span><button onclick="changeQty('${p.id}',1)">+</button></div>
      </div>
    </div>`).join("");
}

function orderText(){
  const items = cartItems();
  const lines = [
    `${state.data.orderSubject || "Stock order"}`,
    "",
    "Hi,",
    "",
    "Please could I order the following:",
    "",
    ...items.map(x=>`• ${x.product.name} — ${x.qty} × ${money(x.product.price)}${x.product.size ? ` (${x.product.size})` : ""} = ${money((x.product.price||0)*x.qty)}`),
    "",
    `Total: ${money(cartTotal())}`,
    "",
    "Thank you!"
  ];
  return lines.join("\n");
}

async function copyOrder(){
  if(!cartItems().length) return toast("Your basket is empty.");
  try{
    await navigator.clipboard.writeText(orderText());
    toast("Order text copied.");
  }catch{
    const ta=document.createElement("textarea"); ta.value=orderText(); document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); toast("Order text copied.");
  }
}
function downloadOrder(){
  if(!cartItems().length) return toast("Your basket is empty.");
  const blob = new Blob([orderText()], {type:"text/plain;charset=utf-8"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href=url; a.download="fresh-face-stock-order.txt"; a.click(); URL.revokeObjectURL(url);
}
function openCart(){ $("#cartDrawer").classList.add("open"); $("#overlay").classList.add("open"); $("#cartDrawer").setAttribute("aria-hidden","false"); }
function closeCart(){ $("#cartDrawer").classList.remove("open"); $("#overlay").classList.remove("open"); $("#cartDrawer").setAttribute("aria-hidden","true"); }
function toast(msg){ const el=$("#toast"); el.textContent=msg; el.classList.add("show"); setTimeout(()=>el.classList.remove("show"),1800); }
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function escAttr(s){return esc(s)}

$("#search").addEventListener("input",render);
$("#rangeFilter").addEventListener("change",render);
$("#statusFilter").addEventListener("change",render);
$("#specialFilter").addEventListener("change",render);
$("#cartButton").addEventListener("click",openCart);
$("#closeCart").addEventListener("click",closeCart);
$("#overlay").addEventListener("click",closeCart);
$("#copyOrder").addEventListener("click",copyOrder);
$("#downloadOrder").addEventListener("click",downloadOrder);
$("#clearCart").addEventListener("click",()=>{state.cart={};localStorage.removeItem("freshFaceStockCart");render();toast("Basket cleared.");});

init();
