const DEFAULTS = [{"id": 1, "name": "Skin patch test kit", "category": "Green Peel Range", "useCase": "Treatment", "professionalPrice": 0.0, "retailPrice": 0.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 2, "name": "Green Peel Herbs", "category": "Green Peel Range", "useCase": "Treatment", "professionalPrice": 395.0, "retailPrice": 395.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 3, "name": "Concentrate Solution", "category": "Green Peel Range", "useCase": "Treatment", "professionalPrice": 45.0, "retailPrice": null, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 4, "name": "Calming Facial Foam (Sensitive Range)", "category": "Sensitive Range", "useCase": "Treatment", "professionalPrice": 34.0, "retailPrice": null, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 5, "name": "Calm Plus Ampoule", "category": "Sensitive Range", "useCase": "Treatment", "professionalPrice": 48.0, "retailPrice": 19.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 6, "name": "Super Soft Cleanser", "category": "Essential Range", "useCase": "Treatment", "professionalPrice": 26.5, "retailPrice": 18.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 7, "name": "Herbal Care Lotion", "category": "Essential Range", "useCase": "Treatment", "professionalPrice": 31.0, "retailPrice": 18.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 8, "name": "Special Care Cream", "category": "Essential Range", "useCase": "Treatment", "professionalPrice": 42.0, "retailPrice": 23.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 9, "name": "Super Enzyme Peeling", "category": "Essential Range", "useCase": "Treatment", "professionalPrice": 60.0, "retailPrice": null, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 10, "name": "Algo Vital Algae Mask", "category": "Essential Range", "useCase": "Mask", "professionalPrice": 34.0, "retailPrice": null, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 11, "name": "Balance+ Mask", "category": "Essential Range", "useCase": "Mask", "professionalPrice": 40.0, "retailPrice": null, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 12, "name": "Special Regulating Cream", "category": "Regulating Range", "useCase": "Treatment", "professionalPrice": 42.0, "retailPrice": 23.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 13, "name": "Blemish Balm Snow", "category": "Regulating Range", "useCase": "Treatment", "professionalPrice": null, "retailPrice": 23.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 14, "name": "Gel Super Purifiant", "category": "Regulating Range", "useCase": "Treatment", "professionalPrice": 25.0, "retailPrice": 20.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 15, "name": "Hair Booster Ampule", "category": "Hair Booster Range", "useCase": "Treatment", "professionalPrice": 50.0, "retailPrice": null, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 16, "name": "Hair Boost Tonic", "category": "Hair Booster Range", "useCase": "Homecare", "professionalPrice": null, "retailPrice": 44.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 17, "name": "Brightening Active C Serum", "category": "Melia White Brightening Range", "useCase": "Treatment", "professionalPrice": 38.0, "retailPrice": 33.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 18, "name": "Brightening Biocellose Mask", "category": "Melia White Brightening Range", "useCase": "Mask", "professionalPrice": 44.0, "retailPrice": null, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 19, "name": "Brightening Day Fluid", "category": "Melia White Brightening Range", "useCase": "Homecare", "professionalPrice": null, "retailPrice": 34.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 20, "name": "Brightening Night Cream", "category": "Melia White Brightening Range", "useCase": "Homecare", "professionalPrice": null, "retailPrice": 36.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 21, "name": "Skin Elixier", "category": "Beauty Elements Range", "useCase": "Treatment", "professionalPrice": 50.0, "retailPrice": 35.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 22, "name": "Cellucountour Body Massage Cream", "category": "Body Science Range", "useCase": "Treatment", "professionalPrice": 30.0, "retailPrice": null, "status": "out", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 23, "name": "Energy Plus Ampoule", "category": "Special orders", "useCase": "Treatment", "professionalPrice": 48.0, "retailPrice": 19.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 24, "name": "Impurity Control Ampoule", "category": "Special orders", "useCase": "Treatment", "professionalPrice": 48.0, "retailPrice": 19.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 25, "name": "Clearing Facial Tonic", "category": "Special orders", "useCase": "Homecare", "professionalPrice": 31.0, "retailPrice": 18.0, "status": "out", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 26, "name": "Clear Skin Silver Fluid", "category": "Special orders", "useCase": "Homecare", "professionalPrice": null, "retailPrice": 17.0, "status": "out", "quantity": null, "lowThreshold": 2, "image": ""}, {"id": 27, "name": "Triple Peeling Effect", "category": "Special orders", "useCase": "Homecare", "professionalPrice": 31.0, "retailPrice": 23.0, "status": "in", "quantity": null, "lowThreshold": 2, "image": ""}];
const KEY="freshFaceStockData_v1", SETTINGS="freshFaceStockSettings_v1", CART="freshFaceCart_v1";
let products = load(KEY, DEFAULTS);
let cart = load(CART, {});
let settings = load(SETTINGS,{businessName:"Fresh Face",supplierName:"",supplierEmail:"",orderNote:""});
function load(k,f){try{const x=localStorage.getItem(k);return x?JSON.parse(x):structuredClone(f)}catch{return structuredClone(f)}}
function save(){localStorage.setItem(KEY,JSON.stringify(products));localStorage.setItem(CART,JSON.stringify(cart));localStorage.setItem(SETTINGS,JSON.stringify(settings))}
function money(n){return n==null?"—":`£${Number(n).toFixed(2)}`}
function statusOf(p){return p.status||"in"}
function statusLabel(s){return {in:"In stock",low:"Running low",out:"Out of stock"}[s]||"Not counted"}
function initials(n){return n.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()}
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
 el.innerHTML=arr.slice(0,8).map(p=>`<div class="attention-row"><div class="prod"><strong>${p.name}</strong><small>${p.category}</small></div><span class="badge ${statusOf(p)}">${statusLabel(statusOf(p))}</span><button class="add-btn" onclick="addToCart(${p.id})">Add</button></div>`).join("");
}
function renderQuick(){
 document.getElementById("quickGrid").innerHTML=products.slice(0,8).map(p=>`<div class="quick-card" onclick="openProducts()"><div class="qtop"><span class="badge ${statusOf(p)}">${statusLabel(statusOf(p))}</span></div><strong>${p.name}</strong><small>${money(p.professionalPrice)} professional</small></div>`).join("");
}
function renderCategories(){
 const s=document.getElementById("categoryFilter"), current=s.value;
 const cats=[...new Set(products.map(p=>p.category))];
 s.innerHTML='<option value="all">All ranges</option>'+cats.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join("");
 s.value=cats.includes(current)?current:"all";
}
function renderTable(){
 const q=(document.getElementById("searchInput")?.value||"").toLowerCase();
 const st=document.getElementById("statusFilter")?.value||"all", cat=document.getElementById("categoryFilter")?.value||"all";
 const rows=products.filter(p=>(!q||p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q))&&(st==="all"||statusOf(p)===st)&&(cat==="all"||p.category===cat));
 document.getElementById("productsTable").innerHTML=rows.map(p=>`<tr>
 <td><div class="product-name"><div class="product-avatar">${initials(p.name)}</div><div><strong>${p.name}</strong><div class="muted">${p.category}</div></div></div></td>
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
 if(!entries.length){el.innerHTML="";empty.style.display="block"}else{empty.style.display="none";el.innerHTML=entries.map(([id,q])=>{const p=products.find(x=>x.id==id);return `<div class="cart-row"><div class="cart-product"><strong>${p.name}</strong><small>${p.category} · ${money(p.professionalPrice)} each</small></div><input class="qty-input cart-qty" type="number" min="1" value="${q}" onchange="changeCart(${p.id},this.value)"><div class="cart-price">${money(p.professionalPrice*q)}</div><button class="remove" onclick="removeFromCart(${p.id})">×</button></div>`}).join("")}
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
document.getElementById("resetData").onclick=()=>{if(confirm("Reset products, basket and settings to the starting data?")){localStorage.removeItem(KEY);localStorage.removeItem(CART);localStorage.removeItem(SETTINGS);location.reload()}};
document.getElementById("businessName").value=settings.businessName||"";document.getElementById("supplierName").value=settings.supplierName||"";document.getElementById("supplierEmail").value=settings.supplierEmail||"";document.getElementById("orderNote").value=settings.orderNote||"";
render();
