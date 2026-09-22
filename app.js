const STORE="freshFaceCatalog_v3", CART="freshFaceCart_v3", SETTINGS="freshFaceSettings_v3";
let db={categories:[],products:[]}, cart=[], settings={businessName:"Fresh Face",supplier:""};
const $=id=>document.getElementById(id);
const money=n=>n==null||n===""?"—":"£"+Number(n).toFixed(2);
const statusName=s=>({in:"In stock",low:"Running low",out:"Out of stock"}[s]||"In stock");
function clone(x){return JSON.parse(JSON.stringify(x))}
function loadLocal(k,f){try{const x=localStorage.getItem(k);return x?JSON.parse(x):f}catch{return f}}
function save(){localStorage.setItem(STORE,JSON.stringify(db));localStorage.setItem(CART,JSON.stringify(cart));localStorage.setItem(SETTINGS,JSON.stringify(settings))}
async function init(){
  const saved=loadLocal(STORE,null);
  if(saved?.products?.length){db=saved}else{
    const r=await fetch("products.json?v="+Date.now(),{cache:"no-store"});
    if(!r.ok)throw new Error("products.json could not be loaded");
    db=await r.json(); save();
  }
  cart=loadLocal(CART,[]); settings=loadLocal(SETTINGS,settings);
  render();
}
function cats(p){return p.categories||[]}
function initials(n){return n.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()}
function toast(s){$("toast").textContent=s;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1700)}
function effectiveStatus(p){return p.status||"in"}
function attentionProducts(){return db.products.filter(p=>!p.specialOrder&&["low","out"].includes(effectiveStatus(p)))}
function render(){
  $("totalStat").textContent=db.products.length;
  $("inStat").textContent=db.products.filter(p=>effectiveStatus(p)==="in").length;
  $("lowStat").textContent=db.products.filter(p=>!p.specialOrder&&effectiveStatus(p)==="low").length;
  $("outStat").textContent=db.products.filter(p=>!p.specialOrder&&effectiveStatus(p)==="out").length;
  const cc=cart.reduce((n,x)=>n+x.qty,0);$("cartCount").textContent=cc;$("topCount").textContent=cc;
  renderAttention();renderMini();renderSnapshot();renderFilters();renderProducts();renderBasket();renderManager();
}
function renderAttention(){
  const a=attentionProducts();$("attention").innerHTML=a.length?a.slice(0,10).map(p=>`<div class="attention-row"><div class="grow"><strong>${esc(p.name)}</strong><small>${esc(cats(p).join(" · "))}</small></div><span class="badge ${p.status}">${statusName(p.status)}</span><button class="add" onclick="addToCart('${p.id}')">Add</button></div>`).join(""):`<div class="empty" style="padding:25px">Nothing currently needs attention ✨</div>`;
}
function renderMini(){
 const el=$("miniBasket"); if(!cart.length){el.innerHTML='<div class="empty" style="padding:25px">Your basket is empty.</div>';return}
 el.innerHTML='<div class="mini">'+cart.slice(0,5).map(x=>{let p=find(x.id);return `<div class="mini-row"><span>${esc(p.name)} × ${x.qty} · ${x.mode}</span><b>${money(price(p,x.mode)*x.qty)}</b></div>`}).join("")+'</div>';
}
function renderSnapshot(){$("snapshot").innerHTML=db.products.slice(0,8).map(p=>`<div class="card" onclick="show('products')"><span class="badge ${p.specialOrder?'special':p.status}">${p.specialOrder?'Special order':statusName(p.status)}</span><strong>${esc(p.name)}</strong><small>${esc(cats(p).join(" · "))}</small></div>`).join("")}
function renderFilters(){
 const s=$("catFilter"), old=s.value, all=[...new Set(db.products.flatMap(cats))].sort();
 s.innerHTML='<option value="all">All ranges</option>'+all.map(c=>`<option>${esc(c)}</option>`).join("");if(all.includes(old))s.value=old;
}
function renderProducts(){
 const q=$("search").value.toLowerCase(), cat=$("catFilter").value, st=$("statusFilter").value;
 const list=db.products.filter(p=>(!q||p.name.toLowerCase().includes(q)||cats(p).some(c=>c.toLowerCase().includes(q)))&&(cat==="all"||cats(p).includes(cat))&&(st==="all"||(st==="special"?p.specialOrder:p.status===st)));
 $("productRows").innerHTML=list.map(p=>`<tr>
 <td><div class="prod"><div class="avatar">${initials(p.name)}</div><strong>${esc(p.name)}</strong></div></td>
 <td><div class="cat-text">${cats(p).map(c=>`<span class="badge special">${esc(c)}</span>`).join(" ")}</div></td>
 <td><select class="stock-select" onchange="setStatus('${p.id}',this.value)">${["in","low","out"].map(s=>`<option value="${s}" ${p.status===s?"selected":""}>${statusName(s)}</option>`).join("")}</select>${p.specialOrder?'<span class="badge special" style="margin-left:5px">Special order</span>':''}</td>
 <td><input class="qty" type="number" min="0" value="${p.stockQty??""}" placeholder="—" onchange="setQty('${p.id}',this.value)"></td>
 <td>${p.professional.price==null?"—":`<b>${money(p.professional.price)}</b>${p.professionalQty?`<small class="hint">${esc(p.professionalQty)}</small>`:""}`} <button class="add" onclick="addToCart('${p.id}','professional')">+ Add</button></td>
 <td>${p.retail.price==null?"—":`<b>${money(p.retail.price)}</b>${p.retailQty?`<small class="hint">${esc(p.retailQty)}</small>`:""}`} <button class="add" onclick="addToCart('${p.id}','retail')">+ Add</button></td>
 </tr>`).join("")||'<tr><td colspan="7" style="padding:30px;text-align:center;color:#81776f">No products match.</td></tr>';
}
function renderBasket(){
 const el=$("basketRows");$("basketEmpty").style.display=cart.length?"none":"block";
 el.innerHTML=cart.map((x,i)=>{let p=find(x.id),pr=price(p,x.mode);return `<div class="basket-row"><div class="basket-product"><strong>${esc(p.name)}</strong><small>${esc(cats(p).join(" · "))} · ${money(pr)} each</small></div><div class="mode"><button class="${x.mode==="professional"?"active":""}" onclick="changeMode(${i},'professional')">Professional</button><button class="${x.mode==="retail"?"active":""}" onclick="changeMode(${i},'retail')">Retail</button></div><input class="qty" type="number" min="1" value="${x.qty}" onchange="changeBasketQty(${i},this.value)"><div class="basket-price">${money(pr*x.qty)}</div><button class="remove" onclick="removeCart(${i})">×</button></div>`}).join("");
 $("lineCount").textContent=cart.length;$("unitCount").textContent=cart.reduce((n,x)=>n+x.qty,0);$("basketTotal").textContent=money(cart.reduce((n,x)=>n+price(find(x.id),x.mode)*x.qty,0));
}
function renderManager(){
 $("categoryManager").innerHTML=db.categories.map(c=>`<div class="range-item"><span>${esc(c)}</span><button class="delete-cat" onclick="deleteCategory('${escAttr(c)}')">Delete</button></div>`).join("");
 $("manageProducts").innerHTML=db.products.map(p=>`<div class="manage-product"><div class="avatar">${initials(p.name)}</div><div class="grow"><strong>${esc(p.name)}</strong><small>${esc(cats(p).join(" · "))}${p.specialOrder?" · Special order":""}</small></div><button class="edit" onclick="editProduct('${p.id}')">Edit</button></div>`).join("");
}
function find(id){return db.products.find(p=>p.id===id)}
function price(p,m){return p?.[m]?.price??null}
function addToCart(id,mode="professional"){let p=find(id), chosen=price(p,mode)!=null?mode:(price(p,"professional")!=null?"professional":"retail");let x=cart.find(x=>x.id===id&&x.mode===chosen);if(x)x.qty++;else cart.push({id,mode:chosen,qty:1});save();render();toast(`${p.name} added`)}
function removeCart(i){cart.splice(i,1);save();render()}
function changeMode(i,m){if(price(find(cart[i].id),m)==null){toast("That price is not listed for this product.");return}cart[i].mode=m;save();render()}
function changeBasketQty(i,v){cart[i].qty=Math.max(1,Number(v)||1);save();render()}
function setStatus(id,v){find(id).status=v;save();render();toast("Stock status updated")}
function setQty(id,v){find(id).stockQty=v===""?null:Number(v);save();render()}
function show(v){document.querySelectorAll(".view").forEach(x=>x.classList.remove("active"));$(v).classList.add("active");document.querySelectorAll(".nav").forEach(x=>x.classList.toggle("active",x.dataset.view===v));$("title").textContent={dashboard:"Dashboard",products:"Products",basket:"Order basket",manage:"Manage catalogue"}[v]}
document.querySelectorAll(".nav").forEach(n=>n.onclick=()=>show(n.dataset.view));$("basketBtn").onclick=()=>show("basket");$("search").oninput=renderProducts;$("catFilter").onchange=renderProducts;$("statusFilter").onchange=renderProducts;
$("addCategory").onclick=()=>{let c=$("newCategory").value.trim();if(!c)return;if(db.categories.some(x=>x.toLowerCase()===c.toLowerCase())){toast("That category already exists");return}db.categories.push(c);$("newCategory").value="";save();render();toast("Category added")};
function deleteCategory(c){if(db.products.some(p=>cats(p).includes(c))){toast("This category is still used by a product.");return}db.categories=db.categories.filter(x=>x!==c);save();render()}
$("newProduct").onclick=()=>openProduct();
function openProduct(id=null){
 $("productModal").classList.add("open");$("editId").value=id||"";$("modalTitle").textContent=id?"Edit product":"New product";
 const p=id?find(id):{name:"",categories:[],professional:{price:null},retail:{price:null},professionalQty:"",retailQty:"",status:"in",specialOrder:false,image:""};
 $("fName").value=p.name;$("fProf").value=p.professional.price??"";$("fRetail").value=p.retail.price??"";$("fProfQty").value=p.professionalQty||"";$("fRetailQty").value=p.retailQty||"";$("fStatus").value=p.status||"in";$("fSpecial").checked=!!p.specialOrder;$("fImage").value=p.image||"";
 $("categoryChecks").innerHTML=db.categories.map(c=>`<label class="check"><input type="checkbox" value="${escAttr(c)}" ${cats(p).includes(c)?"checked":""}>${esc(c)}</label>`).join("");
}
function closeProduct(){$("productModal").classList.remove("open")}
$("productForm").onsubmit=e=>{e.preventDefault();let id=$("editId").value||"p_"+Date.now(),old=find(id), chosen=[...$("categoryChecks").querySelectorAll("input:checked")].map(x=>x.value);let p={id,name:$("fName").value.trim(),categories:chosen,retail:{price:$("fRetail").value===""?null:Number($("fRetail").value)},professional:{price:$("fProf").value===""?null:Number($("fProf").value)},retailQty:$("fRetailQty").value.trim(),professionalQty:$("fProfQty").value.trim(),status:$("fStatus").value,specialOrder:$("fSpecial").checked,stockQty:old?.stockQty??null,image:$("fImage").value.trim()};if(old){db.products=db.products.map(x=>x.id===id?p:x)}else db.products.push(p);save();closeProduct();render();toast("Product saved")};
function editProduct(id){openProduct(id)}
function buildOrder(){let total=0,lines=cart.map((x,i)=>{let p=find(x.id),pr=price(p,x.mode),v=pr*x.qty;total+=v;return `${i+1}. ${p.name} — ${x.mode==="professional"?"PROFESSIONAL":"RETAIL"} — Qty: ${x.qty} — ${money(pr)} each — ${money(v)}`});let d=new Date().toLocaleDateString("en-GB",{day:"2-digit",month:"long",year:"numeric"});return `STOCK ORDER REQUEST\n${settings.businessName||"Fresh Face"}\nDate: ${d}\n${settings.supplier?`Supplier: ${settings.supplier}\n`:""}\nPlease can I order the following:\n\n${lines.join("\n")}\n\nTOTAL: ${money(total)}\n\nThank you.`}
$("createOrder").onclick=()=>{if(!cart.length){toast("Your basket is empty");return}$("orderText").value=buildOrder();$("orderModal").classList.add("open")};
function closeOrder(){$("orderModal").classList.remove("open")}
$("copyOrder").onclick=async()=>{await navigator.clipboard.writeText($("orderText").value);toast("Order copied")};
$("downloadOrder").onclick=()=>{let a=document.createElement("a"),b=new Blob([$("orderText").value],{type:"text/plain"});a.href=URL.createObjectURL(b);a.download="fresh-face-order.txt";a.click();URL.revokeObjectURL(a.href)};
$("exportBtn").onclick=()=>{let a=document.createElement("a"),b=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});a.href=URL.createObjectURL(b);a.download="products.json";a.click();URL.revokeObjectURL(a.href);toast("Catalogue exported")};
function esc(s){return String(s??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;")}
function escAttr(s){return String(s??"").replaceAll("\\","\\\\").replaceAll("'","&#39;")}
init().catch(e=>{console.error(e);document.body.innerHTML='<div style="padding:40px;font-family:Arial"><h2>Could not load the catalogue</h2><p>Make sure index.html, app.js, styles.css and products.json are in the same folder and run <b>python -m http.server 8000</b>.</p></div>'});
