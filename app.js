let products = [];
const PRODUCT_FILE = "products.json";

async function loadProducts() {
  const response = await fetch(PRODUCT_FILE + "?v=" + Date.now(), { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load products.json");
  const catalogue = await response.json();

  // Keep changing stock information locally, but always take
  // product/category/pricing information from products.json.
  const savedStock = load(KEY, {});
  const stockById = savedStock && !Array.isArray(savedStock) ? savedStock : {};

  products = catalogue.map(p => ({
    ...p,
    categories: Array.isArray(p.categories)
      ? p.categories
      : (p.category ? [p.category] : []),
    status: stockById[p.id]?.status ?? p.status ?? "in",
    quantity: stockById[p.id]?.quantity ?? p.quantity ?? null
  }));
}
let cart = load(CART, {});
let settings = load(SETTINGS,{businessName:"Fresh Face",supplierName:"",supplierEmail:"",orderNote:""});
function load(k,f){try{const x=localStorage.getItem(k);return x?JSON.parse(x):structuredClone(f)}catch{return structuredClone(f)}}
function save(){
  const stockState = {};
  products.forEach(p => {
    stockState[p.id] = { status: p.status || "in", quantity: p.quantity ?? null };
  });
  localStorage.setItem(KEY, JSON.stringify(stockState));
  localStorage.setItem(CART, JSON.stringify(cart));
  localStorage.setItem(SETTINGS, JSON.stringify(settings));
}
function money(n){return n==null?"—":`£${Number(n).toFixed(2)}`}
function statusOf(p){return p.status||"in"}
function statusLabel(s){return {in:"In stock",low:"Running low",out:"Out of stock"}[s]||"Not counted"}
function initials(n){return n.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()}
function categoriesOf(p){return Array.isArray(p.categories)?p.categories:(p.category?[p.category]:[])}
function categoryText(p){return categoriesOf(p).join(" · ")}
function hasCategory(p,cat){return cat==="all"||categoriesOf(p).includes(cat)}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),1800)}
function cartCount(){return Object.values(cart).reduce((a,b)=>a+Number(b),0)}
function cartTotal(){return Object.entries(cart).reduce((sum,[id,q])=>{let p=products.find(x=>x.id==id);return sum+(p?.professionalPrice||0)*q},0)}

function render(){
 document.getElementById("statTotal").textContent=products.length;
 document.getElementById("statIn").textContent=products.filter(p=>statusOf(p)==="in").length;
 document.getElementById("statLow").textContent=products.filter(p=>statusOf(p)==="low").length;
 document.getElementById("statOut").textContent=products.filter(p=>statusOf(p)==="out").length;
 const cc=cartCount(); document.getElementById("navCartCount").textContent=cc;document.getElementById("topCartCount").textContent=cc;
 renderAttention(); renderQuick(); renderTable(); renderCart(); renderMiniCart(); renderCategories();
}
function renderAttention(){
 const arr=products.filter(p=>["low","out"].includes(statusOf(p)));
 const el=document.getElementById("attentionList");
 if(!arr.length){el.innerHTML='<div class="empty" style="padding:25px">Nothing currently needs attention ✨</div>';return}
 el.innerHTML=arr.slice(0,8).map(p=>`<div class="attention-row"><div class="prod"><strong>${p.name}</strong><small>${categoryText(p)}</small></div><span class="badge ${statusOf(p)}">${statusLabel(statusOf(p))}</span><button class="add-btn" onclick="addToCart(${p.id})">Add</button></div>`).join("");
}
function renderQuick(){
 document.getElementById("quickGrid").innerHTML=products.slice(0,8).map(p=>`<div class="quick-card" onclick="openProducts()"><div class="qtop"><span class="badge ${statusOf(p)}">${statusLabel(statusOf(p))}</span></div><strong>${p.name}</strong><small>${money(p.professionalPrice)} professional</small></div>`).join("");
}
function renderCategories(){
 const s=document.getElementById("categoryFilter"), current=s.value;
 const cats=[...new Set(products.flatMap(p=>categoriesOf(p)))].sort((a,b)=>a.localeCompare(b));
 s.innerHTML='<option value="all">All ranges</option>'+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
 s.value=cats.includes(current)?current:"all";
}
function renderTable(){
 const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
 const st=document.getElementById("statusFilter")?.value||"all", cat=document.getElementById("categoryFilter")?.value||"all";
 const rows=products.filter(p=>(!q||p.name.toLowerCase().includes(q)||categoriesOf(p).some(c=>c.toLowerCase().includes(q)))&&(st==="all"||statusOf(p)===st)&&(cat==="all"||hasCategory(p,cat)));
 document.getElementById("productsTable").innerHTML=rows.map(p=>`<tr>
 <td><div class="product-name"><div class="product-avatar">${initials(p.name)}</div><div><strong>${p.name}</strong><div class="muted">${categoryText(p)}</div></div></div></td>
 <td>${p.useCase}</td><td class="price">${money(p.professionalPrice)}</td>
 <td><select class="stock-select" onchange="setStatus(${p.id},this.value)">${["in","low","out"].map(s=>`<option value="${s}" ${statusOf(p)===s?"selected":""}>${statusLabel(s)}</option>`).join("")}</select></td>
 <td><input class="qty-input" type="number" min="0" placeholder="—" value="${p.quantity??""}" onchange="setQty(${p.id},this.value)" title="Optional stock count"></td>
 <td><button class="add-btn" onclick="addToCart(${p.id})">+ Add</button></td>
 </tr>`).join("")||'<tr><td colspan="6" class="muted" style="padding:30px;text-align:center">No products match your filters.</td></tr>';
}
function setStatus(id,v){let p=products.find(x=>x.id===id);p.status=v;save();render();toast(`${p.name}: ${statusLabel(v)}`)}
function setQty(id,v){let p=products.find(x=>x.id===id);p.quantity=v===""?null:Number(v);save();render()}
function addToCart(id){let p=products.find(x=>x.id===id);if(!p?.professionalPrice){toast("No professional price is listed for this product.");return}cart[id]=(cart[id]||0)+1;save();render();toast(`${p.name} added to basket`)}
function removeFromCart(id){delete cart[id];save();render()}
function changeCart(id,v){const n=Math.max(1,Number(v)||1);cart[id]=n;save();render()}
function renderCart(){
 const el=document.getElementById("cartList"), empty=document.getElementById("emptyCart");
 const entries=Object.entries(cart).filter(([id])=>products.some(p=>p.id==id));
 if(!entries.length){el.innerHTML="";empty.style.display="block"}else{empty.style.display="none";el.innerHTML=entries.map(([id,q])=>{const p=products.find(x=>x.id==id);return `<div class="cart-row"><div class="cart-product"><strong>${p.name}</strong><small>${categoryText(p)} · ${money(p.professionalPrice)} each</small></div><input class="qty-input cart-qty" type="number" min="1" value="${q}" onchange="changeCart(${p.id},this.value)"><div class="cart-price">${money(p.professionalPrice*q)}</div><button class="remove" onclick="removeFromCart(${p.id})">×</button></div>`}).join("")}
 document.getElementById("summaryItems").textContent=cartCount();document.getElementById("summaryTotal").textContent=money(cartTotal());
}
function renderMiniCart(){
 const el=document.getElementById("miniCart"), entries=Object.entries(cart);
 if(!entries.length){el.innerHTML='<div class="mini-empty">No products added yet.</div>';return}
 el.innerHTML='<div class="cart-mini">'+entries.slice(0,5).map(([id,q])=>{const p=products.find(x=>x.id==id);return `<div class="mini-row"><span>${p.name} × ${q}</span><strong>${money(p.professionalPrice*q)}</strong></div>`}).join("")+'</div><div class="mini-row"><span><b>Total</b></span><strong>'+money(cartTotal())+'</strong></div>';
}
function openView(name){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));document.getElementById(name+"View").classList.add("active");document.querySelectorAll(".nav-item").forEach(n=>n.classList.toggle("active",n.dataset.view===name));document.getElementById("pageTitle").textContent={dashboard:"Dashboard",products:"Products",orders:"Order basket",settings:"Settings"}[name]}
function openProducts(){openView("products")}
function buildOrder(){
 const entries=Object.entries(cart).filter(([id])=>products.some(p=>p.id==id));
 const date=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});
 let lines=[`PROFESSIONAL STOCK ORDER`,`${settings.businessName||"Fresh Face"}`,`Date: ${date}`,settings.supplierName?`Supplier: ${settings.supplierName}`:"",``,`Please can I order the following:`,``,...entries.map(([id,q],i)=>{const p=products.find(x=>x.id==id);return `${i+1}. ${p.name} — Qty: ${q} — ${money(p.professionalPrice)} each — ${money(p.professionalPrice*q)}`}),``,`TOTAL: ${money(cartTotal())}`];
 if(settings.orderNote)lines.push("",`Note: ${settings.orderNote}`);
 lines.push("","Thank you.");
 return lines.filter((x,i)=>x!==""||lines[i-1]!=="").join("\n");
}
function openModal(){if(!cartCount()){toast("Add something to your basket first.");return}document.getElementById("orderText").value=buildOrder();document.getElementById("orderModal").classList.add("open")}
function esc(s){return String(s).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
document.querySelectorAll(".nav-item").forEach(n=>n.addEventListener("click",()=>openView(n.dataset.view)));
document.getElementById("orderBtn").onclick=()=>openView("orders");
document.getElementById("miniCheckout").onclick=openModal;
document.getElementById("checkoutBtn").onclick=openModal;
document.getElementById("showProductsBtn").onclick=openProducts;
document.getElementById("allProductsBtn").onclick=openProducts;
document.getElementById("browseBtn").onclick=openProducts;
["searchInput","statusFilter","categoryFilter"].forEach(id=>document.getElementById(id).addEventListener("input",renderTable));
document.getElementById("closeModal").onclick=()=>document.getElementById("orderModal").classList.remove("open");
document.getElementById("copyOrder").onclick=async()=>{await navigator.clipboard.writeText(document.getElementById("orderText").value);toast("Order copied to clipboard");};
document.getElementById("downloadOrder").onclick=()=>{const blob=new Blob([document.getElementById("orderText").value],{type:"text/plain"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="fresh-face-order.txt";a.click();URL.revokeObjectURL(a.href)};
document.getElementById("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify({products,settings,cart},null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="fresh-face-stock-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Backup exported")};
document.getElementById("saveSettings").onclick=()=>{settings={businessName:document.getElementById("businessName").value,supplierName:document.getElementById("supplierName").value,supplierEmail:document.getElementById("supplierEmail").value,orderNote:document.getElementById("orderNote").value};save();toast("Settings saved")};
document.getElementById("resetData").onclick=()=>{if(confirm("Reset stock statuses, basket and settings? Your products.json catalogue will not be changed.")){localStorage.removeItem(KEY);localStorage.removeItem(CART);localStorage.removeItem(SETTINGS);location.reload()}};
document.getElementById("businessName").value=settings.businessName||"";document.getElementById("supplierName").value=settings.supplierName||"";document.getElementById("supplierEmail").value=settings.supplierEmail||"";document.getElementById("orderNote").value=settings.orderNote||"";
async function init(){
  try {
    await loadProducts();
    render();
  } catch (error) {
    console.error(error);
    document.body.innerHTML = `<div style="font-family:Arial;padding:40px">
      <h2>Could not load products.json</h2>
      <p>Make sure <strong>products.json</strong> is in the same folder as <strong>index.html</strong> and that you are running the site through the Codespaces port.</p>
    </div>`;
  }
}
init();