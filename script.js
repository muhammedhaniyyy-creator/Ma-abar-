// Kiswa Union — student-union store checkout.
const WHATSAPP_NUMBER = "919999999999"; // Replace with the real Kiswa Union WhatsApp number.
const UPI_ID = "kiswaunion@upi"; // Replace with the real UPI ID.
const UPI_NAME = "Kiswa Union";
// The Malli font is a legacy ASCII Malayalam font. Unicode Malayalam is
// converted to the legacy character sequence before it is rendered.
// The conversion table below follows the standard ML-TT/Karthika mapping.
// This approach is used by public Malayalam conversion projects as well.

const MALLI_MAP = {
  "ം":"w","ഃ":"x","അ":"A","ആ":"B","ഇ":"C","ഈ":"Cu","ഉ":"D","ഊ":"Du",
  "ഋ":"E","ഌ":"p","എ":"F","ഏ":"G","ഐ":"sF","ഒ":"H","ഓ":"Hm","ഔ":"Hu",
  "ക":"I","ഖ":"J","ഗ":"K","ഘ":"L","ങ":"M","ച":"N","ഛ":"O","ജ":"P",
  "ഝ":"Q","ഞ":"R","ട":"S","ഠ":"T","ഡ":"U","ഢ":"V","ണ":"W","ത":"X",
  "ഥ":"Y","ദ":"Z","ധ":"[","ന":"\\","പ":"]","ഫ":"^","ബ":"_","ഭ":"`",
  "മ":"a","യ":"b","ര":"c","റ":"d","ല":"e","ള":"f","ഴ":"g","വ":"h",
  "ശ":"i","ഷ":"j","സ":"k","ഹ":"l","ാ":"m","ി":"n","ീ":"o","ു":"p",
  "ൂ":"q","ൃ":"r","െ":"s","േ":"t","ൈ":"ss","ൊ":"sm","ോ":"tm","ൌ":"su",
  "്‌":"v","്":"v","ൗ":"u","്യേ":"ty","്യെ":"sy","ക്ക":"¡","ക്ല":"¢",
  "ക്ഷ":"£","ഗ്ഗ":"¤","ഗ്ല":"¥","ങ്ക":"¦","ങ്ങ":"§","ച്ച":"¨","ഞ്ച":"©",
  "ഞ്ഞ":"ª","ട്ട":"«","ണ്‍":"¬","ണ്ട":"ï","ണ്ണ":"®","ത്ത":"¯","ത്ഥ":"°",
  "ദ്ദ":"±","ദ്ധ":"²","ന്‍":"³","ൻ":"³","ന്ത":"´","ന്ദ":"µ","ന്ന":"¶",
  "ന്മ":"·","പ്പ":"¸","പ്ല":"¹","ബ്ബ":"º","ബ്ല":"»","മ്പ":"¼","മ്മ":"½",
  "മ്ല":"Ÿ","യ്യ":"¿","ർ‌":"À","ർ‍":"À","ർ":"À","ര്‍":"À","റ്റ":"ä",
  "ല്‍":"Â","ൽ":"Â","ല്ല":"Ã","ള്‍":"Ä","ൾ":"Ä","ള്ള":"Å","വ്വ":"Æ",
  "ശ്ല":"Ç","ശ്ശ":"È","സ്ല":"É","സ്സ":"Ê","ഹ്ല":"Ë","സ്റ്റ":"Ì","ഡ്ഡ":"Í",
  "ക്ട":"Î","ബ്ധ":"Ï","ബ്ദ":"Ð","ച്ഛ":"Ñ","ഹ്മ":"Ò","ഹ്ന":"Ó","ന്ധ":"Ô",
  "ത്സ":"Õ","ജ്ജ":"Ö","ണ്മ":"×","സ്ഥ":"Ø","ന്ഥ":"Ù","ജ്ഞ":"Ú","ത്ഭ":"Û",
  "ഗ്മ":"Ü","ശ്ച":"Ý","ണ്ഡ":"Þ","ത്മ":"ß","ക്ത":"à","ഗ്ന":"á","ന്റ":"â",
  "ഷ്ട":"ã","്യ":"y","്വ":"z","്ര":"{","-":"þ"
};

function unicodeToMalli(text){
  if(!text) return "";
  let out = "";
  let reph = false;

  for(let i=0;i<text.length;){
    let found = false;

    for(let len=3; len>=1; len--){
      const part = text.substring(i,i+len);
      if(!(part in MALLI_MAP)) continue;

      const code = MALLI_MAP[part];

      if(part === "ൈ"){
        if(reph){
          out = out.slice(0,-2) + code + out.slice(-2);
          reph = false;
        }else{
          out = out.slice(0,-1) + code + out.slice(-1);
        }
      }else if(["ോ","ൊ","ൌ"].includes(part)){
        if(reph){
          out = out.slice(0,-2) + code[0] + out.slice(-2) + code[1];
          reph = false;
        }else{
          out = out.slice(0,-1) + code[0] + out.slice(-1) + code[1];
        }
      }else if(part === "്യേ" || part === "്യെ"){
        reph = false;
        out = out.slice(0,-1) + code[0] + out.slice(-1) + code[1];
      }else if(["െ","േ","്ര"].includes(part)){
        if(reph){
          out = out.slice(0,-2) + code[0] + out.slice(-2);
          reph = false;
        }else{
          out = out.slice(0,-1) + code[0] + out.slice(-1);
        }
        if(part === "്ര") reph = true;
      }else{
        reph = false;
        out += code;
      }

      i += len;
      found = true;
      break;
    }

    if(!found){
      out += text[i];
      i++;
      reph = false;
    }
  }
  return out;
}

function renderMalliText(root=document){
  root.querySelectorAll(".malli").forEach(el=>{
    if(el.dataset.malliReady === "1") return;
    const original = el.textContent.trim();
    if(!original) return;
    el.dataset.unicodeText = original;
    el.setAttribute("aria-label", original);
    el.textContent = unicodeToMalli(original);
    el.dataset.malliReady = "1";
  });
}

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    name: "Blue Ball Pen",
    cat: "stationery",
    price: 10,
    desc: "Smooth everyday writing pen for class notes and assignments.",
    img: "assets/images/Blue Ball Pen.webp",
    rating: 4.8
  },
  {
    id: 2,
    name: "Black Ball Pen",
    cat: "stationery",
    price: 10,
    desc: "Reliable black ink for exams, forms and everyday writing.",
    img: "assets/images/Black Ball Pen.webp",
    rating: 4.8
  },
  {
    id: 3,
    name: "HB Pencil",
    cat: "stationery",
    price: 8,
    desc: "Classic HB pencil for writing, drawing and diagrams.",
    img: "assets/images/HB Pencil.webp",
    rating: 4.7
  },
  {
    id: 4,
    name: "A4 Notebook",
    cat: "books",
    price: 60,
    desc: "Clean ruled pages for class notes and study plans.",
    img: "assets/images/A4 Notebook.webp",
    rating: 4.9
  },
  {
    id: 5,
    name: "Long Notebook",
    cat: "books",
    price: 75,
    desc: "A practical long notebook for daily college work.",
    img: "assets/images/Long Notebook.webp",
    rating: 4.8
  },
  {
    id: 6,
    name: "Assignment File",
    cat: "stationery",
    price: 35,
    desc: "Keep assignments and important papers organised.",
    img: "assets/images/Assignment File.webp",
    rating: 4.7
  },
  {
    id: 7,
    name: "Highlighter",
    cat: "stationery",
    price: 25,
    desc: "Bright highlighting for revision and quick study.",
    img: "assets/images/Highlighter.webp",
    rating: 4.8
  },
  {
    id: 8,
    name: "Black Marker",
    cat: "stationery",
    price: 30,
    desc: "Bold marker for posters, labels and project work.",
    img: "assets/images/Black Marker.webp",
    rating: 4.7
  },
  {
    id: 9,
    name: "Drawing Book",
    cat: "books",
    price: 45,
    desc: "A handy sketch and drawing book for creative work.",
    img: "assets/images/Drawing Book.webp",
    rating: 4.8
  },
  {
    id: 10,
    name: "Exam Pad",
    cat: "stationery",
    price: 55,
    desc: "Study and exam essential with a sturdy writing surface.",
    img: "assets/images/Exam Pad.webp",
    rating: 4.7
  },
  {
    id: 11,
    name: "Black Tea",
    cat: "tea",
    price: 18,
    desc: "A hot cup for a quick break between classes.",
    img: "assets/images/Black Tea.webp",
    rating: 4.9
  },
  {
    id: 12,
    name: "Milk Tea",
    cat: "tea",
    price: 22,
    desc: "Creamy hot tea for your campus break.",
    img: "assets/images/Milk Tea.webp",
    rating: 4.9
  },
  {
    id: 13,
    name: "Samosa",
    cat: "snacks",
    price: 15,
    desc: "Crispy savoury snack for a quick bite.",
    img: "assets/images/Samosa.webp",
    rating: 4.8
  },
  {
    id: 14,
    name: "Banana Fritter",
    cat: "snacks",
    price: 20,
    desc: "Classic Kerala-style snack for tea time.",
    img: "assets/images/Banana Fry.webp",
    rating: 4.8
  },
  {
    id: 15,
    name: "Laddu",
    cat: "sweet",
    price: 20,
    desc: "A small sweet treat for your break.",
    img: "assets/images/Laddu.webp",
    rating: 4.7
  },
  {
    id: 16,
    name: "Student Essentials Pack",
    cat: "other",
    price: 120,
    desc: "A handy mix of everyday stationery essentials.",
    img: "assets/images/Student Essentials Pack.webp",
    rating: 4.9
  }
];

let products = JSON.parse(localStorage.getItem("kiswaUnionProducts") || "null") || DEFAULT_PRODUCTS;
let cart = JSON.parse(localStorage.getItem("kiswaUnionCart") || "[]");
let favorites = JSON.parse(localStorage.getItem("kiswaUnionFavorites") || "[]");
let activeCategory = "all";
let favOnly = false;
let currentProduct = null;
let pendingOrder = null;
let appliedCoupon = null;
let lastOrder = JSON.parse(localStorage.getItem("kiswaUnionLastOrder") || "null");
let orderHistory = JSON.parse(localStorage.getItem("kiswaUnionOrders") || "[]");

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function saveState(){
  localStorage.setItem("kiswaUnionCart",JSON.stringify(cart));
  localStorage.setItem("kiswaUnionFavorites",JSON.stringify(favorites));
  localStorage.setItem("kiswaUnionProducts",JSON.stringify(products));
  localStorage.setItem("kiswaUnionOrders",JSON.stringify(orderHistory));
}

function money(n){ return `₹${n.toLocaleString("en-IN")}`; }

function toast(message){
  const el=$("#toast");
  el.textContent=message;
  el.classList.add("show");
  clearTimeout(window.__toast);
  window.__toast=setTimeout(()=>el.classList.remove("show"),2200);
}

function openOverlay(){
  $("#overlay").classList.add("show");
  document.body.classList.add("locked");
}
function closeOverlay(){
  $("#overlay").classList.remove("show");
  document.body.classList.remove("locked");
}
function closeAll(){
  $$(".drawer.show,.modal-wrap.show").forEach(el=>el.classList.remove("show"));
  closeOverlay();
}

function openDrawer(id){
  closeAll();
  $(id).classList.add("show");
  openOverlay();
}
function openModal(id){
  closeAll();
  $(id).classList.add("show");
  openOverlay();
}

function renderProducts(){
  const grid=$("#menuGrid");
  let list=products.filter(p=>activeCategory==="all" || p.cat===activeCategory);
  if(favOnly) list=list.filter(p=>favorites.includes(p.id));

  if(!list.length){
    grid.innerHTML=`<div class="empty-state malli">ഇവിടെ ഒന്നുമില്ല… വേറെ ഒന്ന് നോക്കാം.</div>`;
    renderMalliText(grid);
    return;
  }

  grid.innerHTML=list.map(p=>`
    <article class="menu-card">
      <div class="card-img">
        <img src="${p.img}" alt="${p.name}">
        <button class="fav-btn ${favorites.includes(p.id)?"active":""}" data-fav="${p.id}" aria-label="Favorite">${favorites.includes(p.id)?"♥":"♡"}</button>
      </div>
      <div class="card-body">
        <div class="card-top">
          <h3 class="malli">${p.name}</h3>
          <span class="price">${money(p.price)}</span>
        </div>
        <p class="malli">${p.desc}</p>
        <div class="card-actions">
        <button class="add-btn" data-add="${p.id}">Add to Cart</button>
          <button class="info-btn" data-info="${p.id}" aria-label="Details">i</button>
        </div>
      </div>
    </article>
  `).join("");
  renderMalliText(grid);
}

function renderCart(){
  $("#cartCount").textContent=cart.reduce((sum,i)=>sum+i.qty,0);
  const box=$("#cartItems");

  if(!cart.length){
  box.innerHTML=`<div class="empty-state">Your cart is empty.<br>Add something you like!</div>`;
  $("#cartTotal").textContent="₹0";
  return;
}

  box.innerHTML=cart.map(item=>`
    <div class="cart-item">
      <img src="${item.img}" alt="">
      <div>
        <h4 class="malli">${item.name}</h4>
        <p>${money(item.price*item.qty)}</p>
        <div class="qty">
          <button data-minus="${item.id}">−</button>
          <strong>${item.qty}</strong>
          <button data-plus="${item.id}">+</button>
        </div>
      </div>
      <button class="close-btn remove-item" data-remove="${item.id}" aria-label="Remove">×</button>
    </div>
  `).join("");

  const total=cart.reduce((sum,i)=>sum+i.price*i.qty,0);
  $("#cartTotal").textContent=money(total);
  renderMalliText(box);
}

function addToCart(id,qty=1){
  const p=products.find(x=>x.id===id);
  if(!p) return;
  const item=cart.find(x=>x.id===id);
  if(item) item.qty+=qty;
  else cart.push({...p,qty});
  saveState();
  renderCart();
  toast(`Added ${p.name} to cart`);
}

function changeQty(id,delta){
  const item=cart.find(x=>x.id===id);
  if(!item) return;
  item.qty+=delta;
  if(item.qty<=0) cart=cart.filter(x=>x.id!==id);
  saveState();
  renderCart();
}

function toggleFavorite(id){
  if(favorites.includes(id)) favorites=favorites.filter(x=>x!==id);
  else favorites.push(id);
  saveState();
  renderProducts();
}

function showProduct(id){
  const p=products.find(x=>x.id===id);
  if(!p) return;
  currentProduct=p;
  $("#productDetail").innerHTML=`
    <div class="product-large"><img src="${p.img}" alt="${p.name}"></div>
    <span class="section-kicker malli">Kiswa Union menu</span>
    <h2 class="malli">${p.name}</h2>
    <div class="detail-price">${money(p.price)} · ★ ${p.rating}</div>
    <p class="malli">${p.desc}</p>
    <button class="checkout-btn" id="detailAdd">Add to Cart</button>
  `;
  renderMalliText($("#productDetail"));
  openModal("#productModal");
  $("#detailAdd").onclick=()=>{addToCart(p.id);closeAll()};
}

function renderSearch(q=""){
  const results=products.filter(p=>{
    const hay=`${p.name} ${p.desc}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });
  $("#searchResults").innerHTML=results.map(p=>`
    <button class="search-item" data-search-product="${p.id}">
      <span class="malli">${p.name}</span><strong>${money(p.price)}</strong>
    </button>
  `).join("");
  renderMalliText($("#searchResults"));
}

function getSubtotal(){
  return cart.reduce((sum,i)=>sum+i.price*i.qty,0);
}

function getDeliveryFee(){
  return pendingOrder?.type === "delivery" ? 30 : 0;
}

function getDiscount(){
  return appliedCoupon === "KISWA10" ? Math.round(getSubtotal() * 0.10) : 0;
}

function getGrandTotal(){
  return Math.max(0, getSubtotal() + getDeliveryFee() - getDiscount());
}

function updateCheckoutSummary(){
  const subtotal = getSubtotal();
  const fee = $("#orderType")?.value === "delivery" ? 30 : 0;
  const discount = appliedCoupon === "KISWA10" ? Math.round(subtotal * 0.10) : 0;
  const total = Math.max(0, subtotal + fee - discount);

  if ($("#checkoutSubtotal")) $("#checkoutSubtotal").textContent = money(subtotal);
  if ($("#deliveryFee")) $("#deliveryFee").textContent = fee ? money(fee) : "FREE";
  if ($("#checkoutTotal")) $("#checkoutTotal").textContent = money(total);

  const msg = $("#couponMessage");
  if (msg) msg.textContent = appliedCoupon === "KISWA10" ? "KISWA10 · 10% discount applied" : "";
}

function makeWhatsAppMessage(orderNo=""){
  if(!cart.length && !lastOrder) return "";

  const sourceItems = cart.length ? cart : (lastOrder?.items || []);
  const lines = sourceItems.map(i=>`• ${i.name} × ${i.qty} = ${money(i.price*i.qty)}`);
  const subtotal = cart.length ? getSubtotal() : (lastOrder?.subtotal || 0);
  const discount = cart.length ? getDiscount() : (lastOrder?.discount || 0);
  const deliveryFee = cart.length ? getDeliveryFee() : (lastOrder?.deliveryFee || 0);
  const total = cart.length ? getGrandTotal() : (lastOrder?.total || subtotal);
  const order = pendingOrder || lastOrder || {};

  return `KISWA UNION ORDER

Order ID: ${orderNo || order.orderNo || "-"}

Student Name: ${order.studentName || "-"}
Category: ${order.studentCategory || "-"}
Admission No: ${order.admissionNumber || "-"}

ITEMS
${lines.join("\n")}

Order Type: ${order.type === "delivery" ? "Delivery" : "Pickup"}
${order.type === "delivery" ? `Address: ${order.address || "-"}\nLandmark: ${order.landmark || "-"}\n` : ""}Subtotal: ${money(subtotal)}
${discount ? `Discount: -${money(discount)}\n` : ""}${deliveryFee ? `Delivery: ${money(deliveryFee)}\n` : ""}TOTAL: ${money(total)}

Payment: ${order.payment || "UPI"}
Payment Status: ${order.paymentStatus || "Paid"}

Bill PDF: attached by student`;
}

function getCurrentOrderForBill(orderNo=""){
  const sourceItems = cart.length ? cart : (lastOrder?.items || []);
  const order = pendingOrder || lastOrder || {};
  const subtotal = cart.length ? getSubtotal() : (lastOrder?.subtotal || 0);
  const discount = cart.length ? getDiscount() : (lastOrder?.discount || 0);
  const deliveryFee = cart.length ? getDeliveryFee() : (lastOrder?.deliveryFee || 0);
  const total = cart.length ? getGrandTotal() : (lastOrder?.total || subtotal);
  return { order, sourceItems, subtotal, discount, deliveryFee, total, orderNo: orderNo || order.orderNo || "KU-PREVIEW" };
}

async function downloadBillPDF(orderNo=""){
  const {order, sourceItems, subtotal, discount, deliveryFee, total, orderNo: id} = getCurrentOrderForBill(orderNo);
  if(!sourceItems.length){ toast("Add an item to prepare the bill."); return; }
  if(!window.jspdf || !window.html2canvas){ toast("PDF service load ആയിട്ടില്ല. Internet connection പരിശോധിക്കൂ."); return; }

  const bill = document.createElement("div");
  bill.id = "pdfBillTemp";
  bill.style.cssText = "position:fixed;left:-10000px;top:0;width:794px;padding:54px;background:#fffdf7;color:#211a16;font-family:Arial,sans-serif;z-index:-1;";
  const itemRows = sourceItems.map(i=>`<tr><td style="padding:10px 6px;border-bottom:1px solid #ddd">${escapeHtml(i.name)}</td><td style="padding:10px 6px;border-bottom:1px solid #ddd;text-align:center">${i.qty}</td><td style="padding:10px 6px;border-bottom:1px solid #ddd;text-align:right">${money(i.price*i.qty)}</td></tr>`).join("");
  bill.innerHTML = `
    <div style="font-size:15px;letter-spacing:2px;text-transform:uppercase">KISWA UNION</div>
    <h1 style="margin:8px 0 4px;font-size:32px">Student Store Bill</h1>
    <div style="color:#76695f;margin-bottom:28px">Order ID: ${escapeHtml(id)} · ${new Date().toLocaleString()}</div>
    <div style="border:1px solid #d8c9b7;padding:18px;border-radius:14px;margin-bottom:24px">
      <div><b>Student Name:</b> ${escapeHtml(order.studentName || "-")}</div>
      <div style="margin-top:7px"><b>Category:</b> ${escapeHtml(order.studentCategory || "-")}</div>
      <div style="margin-top:7px"><b>Admission No:</b> ${escapeHtml(order.admissionNumber || "-")}</div>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:16px"><thead><tr><th style="text-align:left;padding:10px 6px;border-bottom:2px solid #211a16">Item</th><th style="padding:10px 6px;border-bottom:2px solid #211a16">Qty</th><th style="text-align:right;padding:10px 6px;border-bottom:2px solid #211a16">Amount</th></tr></thead><tbody>${itemRows}</tbody></table>
    <div style="margin-left:auto;width:300px;margin-top:24px;font-size:16px">
      <div style="display:flex;justify-content:space-between;padding:6px 0"><span>Subtotal</span><b>${money(subtotal)}</b></div>
      ${discount ? `<div style="display:flex;justify-content:space-between;padding:6px 0"><span>Discount</span><b>- ${money(discount)}</b></div>` : ""}
      ${deliveryFee ? `<div style="display:flex;justify-content:space-between;padding:6px 0"><span>Delivery</span><b>${money(deliveryFee)}</b></div>` : ""}
      <div style="display:flex;justify-content:space-between;padding:12px 0;margin-top:6px;border-top:2px solid #211a16;font-size:22px"><span>Total</span><b>${money(total)}</b></div>
    </div>
    <div style="margin-top:42px;padding-top:16px;border-top:1px dashed #b9aa98;color:#76695f">Payment: ${escapeHtml(order.payment || "UPI")} · Status: ${escapeHtml(order.paymentStatus || "Pending")}</div>
    <div style="margin-top:24px;text-align:center;font-size:14px;color:#76695f">Thank you for shopping at Kiswa Union.</div>`;
  document.body.appendChild(bill);
  try{
    const canvas = await html2canvas(bill,{scale:2,backgroundColor:"#fffdf7",useCORS:true});
    const {jsPDF} = window.jspdf;
    const pdf = new jsPDF("p","mm","a4");
    const img = canvas.toDataURL("image/jpeg",0.95);
    const pageW = 210, margin = 10, imgW = pageW - margin*2;
    const imgH = canvas.height * imgW / canvas.width;
    let y = margin;
    if(imgH <= 277){ pdf.addImage(img,"JPEG",margin,y,imgW,imgH); }
    else {
      let remaining = imgH, sourceY = 0;
      const pageH = 277;
      while(remaining > 0){
        const sliceH = Math.min(pageH,remaining);
        pdf.addImage(img,"JPEG",margin,y,imgW,imgH,undefined,"FAST",0);
        remaining = 0;
      }
    }
    pdf.save(`Kiswa-Union-Bill-${id}.pdf`);
    toast("Bill PDF downloaded");
  } finally { bill.remove(); }
}

function escapeHtml(value){
  return String(value ?? "").replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;","\"":"&quot;"}[c]));
}

function openCheckout(){
  if(!cart.length) return;
  openModal("#checkoutModal");
}

function finishPayment(){
  if(!pendingOrder) return;

  const orderNo="KU-"+Math.floor(100000+Math.random()*900000);
  const orderData = {
    ...pendingOrder,
    paymentStatus: "Paid",
    orderNo,
    items: cart.map(item=>({...item})),
    subtotal: getSubtotal(),
    discount: getDiscount(),
    deliveryFee: getDeliveryFee(),
    total: getGrandTotal(),
    createdAt: Date.now()
  };

  lastOrder = orderData;
  orderHistory.push(orderData);
  localStorage.setItem("kiswaUnionLastOrder", JSON.stringify(orderData));
  localStorage.setItem("kiswaUnionOrders", JSON.stringify(orderHistory));

  $("#orderNumber").textContent=`Order ID: ${orderNo}`;
  closeAll();
  openModal("#successModal");

  const msg=makeWhatsAppMessage(orderNo);
  if(msg){
    const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.__lastWhatsApp=url;
  }

  cart=[];
  appliedCoupon=null;
  saveState();
  renderCart();
}


const ADMIN_PIN = "2511"; // Change this PIN before publishing.
let adminUnlocked = false;

function adminOpen(){
  if(!adminUnlocked){
    const pin = window.prompt("Kiswa Union Admin PIN");
    if(pin !== ADMIN_PIN){ toast("Admin access denied"); return; }
    adminUnlocked = true;
  }
  renderAdmin();
  openModal("#adminModal");
}

function renderAdmin(){
  const totalSales = orderHistory.reduce((s,o)=>s + Number(o.total||0),0);
  const totalItems = orderHistory.reduce((s,o)=>s + (o.items||[]).reduce((a,i)=>a+Number(i.qty||0),0),0);
  const categories = [...new Set(products.map(p=>p.cat))].length;
  $("#adminStats").innerHTML = `
    <div class="admin-stat"><strong>${orderHistory.length}</strong><span>Orders</span></div>
    <div class="admin-stat"><strong>${money(totalSales)}</strong><span>Sales</span></div>
    <div class="admin-stat"><strong>${totalItems}</strong><span>Items sold</span></div>
    <div class="admin-stat"><strong>${categories}</strong><span>Categories</span></div>`;

  $("#adminProductList").innerHTML = products.map(p=>`
    <div class="admin-product-row">
      <img src="${escapeHtml(p.img)}" alt="">
      <div class="admin-product-main"><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.cat)} · ${money(p.price)}</small></div>
      <div class="admin-product-actions"><button data-admin-edit="${p.id}">Edit</button><button class="danger" data-admin-delete="${p.id}">Delete</button></div>
    </div>`).join("");

  const recent = orderHistory.slice().reverse().slice(0,8);
  $("#adminOrders").innerHTML = recent.length ? recent.map(o=>`
    <div class="admin-order-row"><div><strong>${escapeHtml(o.orderNo||"-")}</strong><small>${escapeHtml(o.studentName||"-")} · ${escapeHtml(o.studentCategory||"-")}</small></div><strong>${money(Number(o.total||0))}</strong></div>`).join("") : `<p class="malli admin-empty">No orders yet.</p>`;
}

function resetAdminForm(){
  $("#adminProductForm").reset();
  $("#adminProductId").value="";
  $("#adminFormTitle").textContent="പുതിയ Product";
}

function fillAdminForm(id){
  const p=products.find(x=>x.id===Number(id)); if(!p)return;
  $("#adminProductId").value=p.id;
  $("#adminProductName").value=p.name;
  $("#adminProductPrice").value=p.price;
  $("#adminProductCat").value=p.cat;
  $("#adminProductDesc").value=p.desc||"";
  $("#adminProductImg").value=p.img||"";
  $("#adminFormTitle").textContent="Product Edit ചെയ്യാം";
  $("#adminProductName").focus();
}

function saveAdminProduct(e){
  e.preventDefault();
  const id=Number($("#adminProductId").value||0);
  const name=$("#adminProductName").value.trim();
  const price=Number($("#adminProductPrice").value);
  const cat=$("#adminProductCat").value;
  const desc=$("#adminProductDesc").value.trim();
  const img=$("#adminProductImg").value.trim() || "assets/images/shop-clean.jpg";
  if(!name || !price || !cat){toast("Name, price, category നൽകണം");return;}
  if(id){
    const p=products.find(x=>x.id===id); if(p) Object.assign(p,{name,price,cat,desc,img});
  }else{
    products.push({id:Date.now(),name,price,cat,desc,img,rating:5});
  }
  saveState(); renderProducts(); renderAdmin(); resetAdminForm(); toast("Product saved");
}

function deleteAdminProduct(id){
  const p=products.find(x=>x.id===Number(id)); if(!p)return;
  if(!window.confirm(`Delete ${p.name}?`))return;
  products=products.filter(x=>x.id!==Number(id));
  cart=cart.filter(x=>x.id!==Number(id));
  favorites=favorites.filter(x=>x!==Number(id));
  saveState(); renderProducts(); renderCart(); renderAdmin(); toast("Product deleted");
}

document.addEventListener("DOMContentLoaded",()=>{
  window.addEventListener("scroll",()=>$(".site-header")?.classList.toggle("scrolled",window.scrollY>50));
  renderMalliText(document);
  renderProducts();
  renderCart();
  updateCheckoutSummary();

  setTimeout(()=>$("#loader").classList.add("hide"),850);

  $("#menuToggle").onclick=()=>$("#navLinks").classList.toggle("show");
  $$(".nav-links a").forEach(a=>a.onclick=()=>$("#navLinks").classList.remove("show"));

  $("#cartOpen").onclick=()=>openDrawer("#cartDrawer");
  $("#searchOpen").onclick=()=>{openDrawer("#searchDrawer");renderSearch($("#searchInput").value)};
  $("#searchInput").addEventListener("input",e=>renderSearch(e.target.value));

  $("#overlay").onclick=closeAll;
  $$("[data-close]").forEach(btn=>btn.onclick=closeAll);

  $("#categoryTabs").addEventListener("click",e=>{
    const btn=e.target.closest("button[data-category]");
    if(!btn)return;
    activeCategory=btn.dataset.category;
    $$("#categoryTabs button").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    renderProducts();
  });

  $("#favOnly").onclick=()=>{
    favOnly=!favOnly;
    $("#favOnly").style.background=favOnly?"var(--brown)":"transparent";
    $("#favOnly").style.color=favOnly?"var(--cream)":"var(--brown)";
    renderProducts();
  };

  $("#menuGrid").addEventListener("click",e=>{
    const add=e.target.closest("[data-add]");
    const fav=e.target.closest("[data-fav]");
    const info=e.target.closest("[data-info]");
    if(add) addToCart(Number(add.dataset.add));
    if(fav) toggleFavorite(Number(fav.dataset.fav));
    if(info) showProduct(Number(info.dataset.info));
  });

  $("#cartItems").addEventListener("click",e=>{
    const plus=e.target.closest("[data-plus]");
    const minus=e.target.closest("[data-minus]");
    const remove=e.target.closest("[data-remove]");
    if(plus) changeQty(Number(plus.dataset.plus),1);
    if(minus) changeQty(Number(minus.dataset.minus),-1);
    if(remove) changeQty(Number(remove.dataset.remove),-999);
  });

  $("#searchResults").addEventListener("click",e=>{
    const b=e.target.closest("[data-search-product]");
    if(b) showProduct(Number(b.dataset.searchProduct));
  });

  $("#viewAll").onclick=()=>{
    activeCategory="all";favOnly=false;
    $$("#categoryTabs button").forEach(b=>b.classList.toggle("active",b.dataset.category==="all"));
    renderProducts();
    $("#menu").scrollIntoView({behavior:"smooth"});
  };

  $("#teaPourBtn").onclick=()=>{
    const tea=$("#teaAction");
    tea.classList.remove("active");
    void tea.offsetWidth;
    tea.classList.add("active");
    toast("Tea is ready…");
    setTimeout(()=>tea.classList.remove("active"),2600);
  };

  $("#offerAdd").onclick=()=>{
    addToCart(9);
    addToCart(4);
    toast("Student combo added");
  };

  $("#checkoutOpen").onclick=openCheckout;

  $("#orderType").addEventListener("change", e=>{
    const delivery = e.target.value === "delivery";
    $("#deliveryFields").hidden = !delivery;
    const cash = document.querySelector('input[name="pay"][value="cash"]');
    if(cash) cash.disabled = delivery;
    if(delivery && cash?.checked){
      document.querySelector('input[name="pay"][value="upi"]').checked = true;
    }
    updateCheckoutSummary();
  });

  $("#couponBtn").onclick=()=>{
    const code=($("#couponInput").value || "").trim().toUpperCase();
    if(code === "KISWA10"){
      appliedCoupon="KISWA10";
      toast("10% discount applied 🎉");
    }else{
      appliedCoupon=null;
      toast("Coupon not available");
    }
    updateCheckoutSummary();
  };

  $("#trackOrderBtn").onclick=()=>{
    if(!lastOrder){
      toast("There is no order to track yet");
      return;
    }
    $("#trackingId").textContent=lastOrder.orderNo;
    $("#trackingNote").textContent =
      lastOrder.type === "delivery"
      ? "ഓർഡർ തയ്യാറാക്കി ഡെലിവറിക്ക് അയയ്ക്കുന്നു…"
      : "ഓർഡർ തയ്യാറാക്കി. കടയിൽ നിന്ന് എടുക്കാം…";
    openModal("#trackingModal");
  };

  $("#checkoutForm").onsubmit=e=>{
    e.preventDefault();

    const type=$("#orderType").value;
    const address=$("#deliveryAddress")?.value.trim() || "";
    const landmark=$("#deliveryLandmark")?.value.trim() || "";

    if(type === "delivery" && !address){
      toast("Please enter the delivery address");
      $("#deliveryAddress")?.focus();
      return;
    }

    const studentName=$("#studentName").value.trim();
    const studentCategory=$("#studentCategory").value;
    const admissionNumber=$("#admissionNumber").value.trim();

    if(!studentName || !studentCategory || !admissionNumber){
      toast("Name, category and admission number are required");
      return;
    }

    pendingOrder={
      studentName,
      studentCategory,
      admissionNumber,
      type,
      address,
      landmark,
      payment:"UPI",
      paymentStatus:"Pending"
    };

    $("#fakeAmount").textContent=money(getGrandTotal());
    const upiUrl=`upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent(UPI_NAME)}&am=${encodeURIComponent(Number(getGrandTotal()).toFixed(2))}&cu=INR`;
    $("#upiPayBtn").href=upiUrl;
    $("#upiIdText").textContent=UPI_ID;
    $("#upiQr").innerHTML="";
    if(window.QRCode){ new QRCode($("#upiQr"),{text:upiUrl,width:170,height:170}); }
    openModal("#paymentModal");
  };

  $("#payNow").onclick=()=>{
    $("#payNow").textContent="Order തയ്യാറാക്കുന്നു…";
    setTimeout(()=>{
      if(pendingOrder) pendingOrder.paymentStatus="Paid";
      $("#payNow").textContent="പേയ്മെന്റ് ചെയ്തു → WhatsApp";
      finishPayment();
    },850);
  };

  $("#downloadBillBtn").onclick=()=>downloadBillPDF(lastOrder?.orderNo || "");
  $("#downloadBillSuccessBtn").onclick=()=>downloadBillPDF(lastOrder?.orderNo || "");
  $("#sendWhatsAppBtn").onclick=()=>{
    if(!lastOrder){toast("Order not found");return;}
    const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(makeWhatsAppMessage(lastOrder.orderNo))}`;
    window.open(url,"_blank","noopener");
  };

  $("#whatsappBtn").onclick=()=>{
    if(!lastOrder && !cart.length){toast("Prepare an order first");return;}
    const url=`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(makeWhatsAppMessage(lastOrder?.orderNo || ""))}`;
    window.open(url,"_blank","noopener");
  };

  $("#adminOpen").onclick=adminOpen;
  $("#adminProductForm").onsubmit=saveAdminProduct;
  $("#adminNewProduct").onclick=resetAdminForm;
  $("#adminProductList").addEventListener("click",e=>{
    const edit=e.target.closest("[data-admin-edit]");
    const del=e.target.closest("[data-admin-delete]");
    if(edit) fillAdminForm(edit.dataset.adminEdit);
    if(del) deleteAdminProduct(del.dataset.adminDelete);
  });
  $("#adminClearOrders").onclick=()=>{
    if(!window.confirm("Clear local order history?"))return;
    orderHistory=[]; saveState(); renderAdmin(); toast("Analytics cleared");
  };
  document.addEventListener("keydown",e=>{
    if(e.ctrlKey && e.shiftKey && e.key.toLowerCase()==="a"){ e.preventDefault(); adminOpen(); }
  });

  $("#loginOpen").onclick=()=>openModal("#loginModal");
  $("#loginForm").onsubmit=e=>{
    e.preventDefault();
    closeAll();
    toast("Demo login successful");
  };

  document.addEventListener("keydown",e=>{
    if(e.key==="Escape") closeAll();
  });

  // Small intersection animation
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) entry.target.classList.add("in-view");
    });
  },{threshold:.12});
  $$(".menu-card,.story-image,.story-copy,.offer-card,.visit-card").forEach(el=>observer.observe(el));

  // Font diagnostic
  setTimeout(()=>{
    if(document.fonts && !document.fonts.check('20px "ML-TA-Malli"')){
      console.warn("ML-TA-Malli font did not load. Check assets/fonts/ML-TA-Malli.otf");
    }
  },700);
});


