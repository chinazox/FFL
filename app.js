let data = [];
let rangeOrder = [];
let cart = JSON.parse(localStorage.getItem('freshFaceCart') || '{}');
let range = 'All';
let status = 'All';

const $ = s => document.querySelector(s);

const money = n =>
  n == null
    ? '—'
    : new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP'
      }).format(n);

async function init() {
  const res = await fetch('products.json');
  const json = await res.json();

  data = json.products;
  rangeOrder = json.rangeOrder;

  populateRangeFilter();
  setupStatusFilters();
  render();
}

function populateRangeFilter() {
const ranges = rangeOrder.filter(r =>
  data.some(p => p.range.includes(r))
);

  $('#rangeFilter').innerHTML =
    '<option value="All">All ranges</option>' +
    ranges
      .map(r => `<option value="${esc(r)}">${esc(r)}</option>`)
      .join('');

  $('#rangeFilter').value = range;
}

function setupStatusFilters() {
  document.querySelectorAll('[data-status]').forEach(button => {
    button.onclick = () => {
      status = button.dataset.status;

      document.querySelectorAll('[data-status]').forEach(btn => {
        btn.classList.toggle(
          'active',
          btn.dataset.status === status
        );
      });

      render();
    };
  });
}

function filtered() {
  const q = $('#search').value.trim().toLowerCase();

  return data.filter(p => {
    const matchesRange =
      range === 'All' || p.range.includes(range);

    const matchesStatus =
      status === 'All' ||
      p.status === status;

    const matchesSearch =
      !q ||
      `${p.name} ${p.range.join(' ')}`
        .toLowerCase()
        .includes(q);

    return matchesRange && matchesStatus && matchesSearch;
  });
}

function render() {
  const list = filtered();

  const counts = {
    in: data.filter(p => p.status === 'In stock').length,

    low: data.filter(p => p.status === 'Running low').length,

    out: data.filter(
      p => p.status === 'Out of stock' && !p.specialOrder
    ).length,

    special: data.filter(p => p.specialOrder).length
  };

  $('#stats').innerHTML = `
    <div class="stat">
      <strong>${data.length}</strong>
      <span>Total products</span>
    </div>

    <div class="stat">
      <strong>${counts.in}</strong>
      <span>In stock</span>
    </div>

    <div class="stat">
      <strong>${counts.low}</strong>
      <span>Running low · action needed</span>
    </div>

    <div class="stat">
      <strong>${counts.out}</strong>
      <span>Out of stock · excluding special order</span>
    </div>
  `;

  $('#productTable').innerHTML = list.map(row).join('');

  $('#emptyState').hidden = list.length !== 0;

  document.querySelectorAll('[data-product]').forEach(el => {
    el.onclick = () => openProduct(el.dataset.product);
  });

  document.querySelectorAll('[data-add]').forEach(el => {
    el.onclick = () => add(el.dataset.add);
  });

  updateCartUI();
}

function row(p) {
  const visibleStatus = p.specialOrder
    ? `<span class="status special">Special order</span>`
    : `<span class="status ${
        p.status === 'In stock'
          ? 'in'
          : p.status === 'Running low'
          ? 'low'
          : 'out'
      }">${p.status}</span>`;

  return `
    <tr>
      <td>
        <span class="product-name" data-product="${p.id}">
          ${esc(p.name)}
        </span>
      </td>

      <td class="range">
        ${p.range
          .map(x => `<span>${esc(x)}</span>`)
          .join('')}
      </td>

      <td>${esc(p.size)}</td>

      <td class="price">
        ${money(p.price)}
      </td>

      <td>
        ${visibleStatus}
      </td>

      <td>
        <div class="row-actions">
          <button
            class="small-btn"
            data-product="${p.id}"
          >
            View
          </button>

          ${
            p.price != null
              ? `
                <button
                  class="small-btn add"
                  data-add="${p.id}"
                >
                  Add
                </button>
              `
              : ''
          }
        </div>
      </td>
    </tr>
  `;
}

function add(id) {
  cart[id] = (cart[id] || 0) + 1;
  save();
  render();
  openDrawer();
}

function change(id, delta) {
  cart[id] = (cart[id] || 0) + delta;

  if (cart[id] <= 0) {
    delete cart[id];
  }

  save();
  render();
}

function save() {
  localStorage.setItem(
    'freshFaceCart',
    JSON.stringify(cart)
  );
}

function updateCartUI() {
  const entries = Object.entries(cart)
    .map(([id, qty]) => ({
      p: data.find(x => x.id === id),
      qty
    }))
    .filter(x => x.p);

  const subtotal = entries.reduce(
  (s, x) => s + (x.p.price || 0) * x.qty,
  0
);

const vat = subtotal * 0.20;

const total = subtotal + vat;

  $('#cartCount').textContent =
    entries.reduce((s, x) => s + x.qty, 0);

  $('#cartTotal').textContent = money(total);
  $('#cartSubtotal').textContent = money(subtotal);
  $('#cartVat').textContent = money(vat);

  $('#cartItems').innerHTML = entries.length
    ? entries
        .map(
          x => `
            <div class="cart-item">

              <div>
                <div class="cart-item-name">
                  ${esc(x.p.name)}
                </div>

                <div class="cart-item-meta">
                  ${money(x.p.price)} each · ${x.p.size}
                </div>
              </div>

              <div class="qty">
                <button data-minus="${x.p.id}">
                  −
                </button>

                <strong>${x.qty}</strong>

                <button data-plus="${x.p.id}">
                  +
                </button>
              </div>

            </div>
          `
        )
        .join('')
    : `
      <div class="empty">
        Your basket is empty.<br>
        Add products you need to order.
      </div>
    `;

  document.querySelectorAll('[data-minus]').forEach(b => {
    b.onclick = () =>
      change(b.dataset.minus, -1);
  });

  document.querySelectorAll('[data-plus]').forEach(b => {
    b.onclick = () =>
      change(b.dataset.plus, 1);
  });
}

function openDrawer() {
  $('#drawer').classList.add('open');
  $('#drawer').setAttribute('aria-hidden', 'false');
  $('#overlay').hidden = false;
}

function closeDrawer() {
  $('#drawer').classList.remove('open');
  $('#drawer').setAttribute('aria-hidden', 'true');
  $('#overlay').hidden = true;
}

function openProduct(id) {
  const p = data.find(x => x.id === id);

  if (!p) return;

  $('#dialogContent').innerHTML = `
    <div class="product-modal">

      <div class="image-placeholder">
        ${
          p.image
            ? `<img src="${esc(p.image)}" alt="${esc(p.name)}">`
            : `
              PRODUCT IMAGE

              <br><br>

              Add an
              <code>image</code>
              path in products.json,
              then place the file in /images.
            `
        }
      </div>

      <div>

        <p class="eyebrow">
          ${p.range.map(esc).join(' · ')}
        </p>

        <h2>${esc(p.name)}</h2>

        <p class="muted">
          ${esc(
            p.description ||
              'No description added yet.'
          )}
        </p>

        <div class="detail-price">
          ${money(p.price)}
        </div>

        <div class="detail-meta">

          <div>
            Size / pack
            <strong>${esc(p.size)}</strong>
          </div>

          <div>
            Status
            <strong>
              ${
                p.specialOrder
                  ? 'Special order · '
                  : ''
              }${esc(p.status)}
            </strong>
          </div>

        </div>

        <button
          class="primary"
          style="margin-top:22px"
          ${p.price == null ? 'disabled' : ''}
          onclick="
            add('${p.id}');
            document.getElementById('productDialog').close()
          "
        >
          Add to order
        </button>

      </div>
    </div>
  `;

  $('#productDialog').showModal();
}

function makeOrder() {
  const entries = Object.entries(cart)
    .map(([id, qty]) => ({
      p: data.find(x => x.id === id),
      qty
    }))
    .filter(x => x.p);

  if (!entries.length) {
    return alert('Your basket is empty.');
  }

  const lines = [
    'Hello,',
    '',
    'Please can I place an order for the following:',
    '',
    ...entries.map(
      x =>
        `• ${x.qty} x ${x.p.name}, ${x.p.size}${
          x.p.price != null
          ? ` — ${money(x.p.price * x.qty)}`
          : ''
        }`
    ),
    '',
    'Thank you!'
  ];

  $('#orderText').value =
    lines.join('\n');

  $('#orderDialog').showModal();
}

function esc(s) {
  return String(s).replace(
    /[&<>"']/g,
    c =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      }[c])
  );
}


/* SEARCH */

$('#search').addEventListener(
  'input',
  render
);


/* RANGE DROPDOWN */

$('#rangeFilter').addEventListener(
  'change',
  e => {
    range = e.target.value;
    render();
  }
);


/* BASKET */

$('#cartButton').onclick = openDrawer;

$('#closeDrawer').onclick =
  closeDrawer;

$('#overlay').onclick =
  closeDrawer;

$('#checkout').onclick =
  makeOrder;

$('#clearCart').onclick = () => {
  cart = {};
  save();
  render();
};


/* PRODUCT DIALOG */

$('#closeDialog').onclick = () =>
  $('#productDialog').close();


/* ORDER DIALOG */

$('#closeOrder').onclick = () =>
  $('#orderDialog').close();


/* COPY ORDER */

$('#copyOrder').onclick = async () => {
  await navigator.clipboard.writeText(
    $('#orderText').value
  );

  $('#copyOrder').textContent =
    'Copied ✓';

  setTimeout(() => {
    $('#copyOrder').textContent =
      'Copy order text';
  }, 1500);
};


/* DOWNLOAD ORDER */

$('#downloadOrder').onclick = () => {
  const blob = new Blob(
    [$('#orderText').value],
    {
      type: 'text/plain'
    }
  );

  const a =
    document.createElement('a');

  a.href =
    URL.createObjectURL(blob);

  a.download =
    'fresh-face-order.txt';

  a.click();

  URL.revokeObjectURL(a.href);
};


/* START */

init();