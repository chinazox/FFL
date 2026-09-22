# Fresh Face Stock Manager

A simple, private, static stock-management website designed to be edited through one JSON file.

## Files

- `index.html` — the website structure
- `styles.css` — all visual styling
- `app.js` — filtering, basket, totals and order-text generation
- `products.json` — **the main file you edit**
- `README.md` — these instructions

## How to change stock

Open `products.json`.

Each product looks like this:

```json
{
  "id": "example-product",
  "name": "Example Product",
  "range": ["Essential Range", "Retail"],
  "size": "50ml",
  "price": 23.00,
  "specialOrder": false,
  "status": "in_stock",
  "image": ""
}
```

### Status values

Use exactly one of:

- `"in_stock"`
- `"running_low"`
- `"out_of_stock"`

### Special-order products

Set:

```json
"specialOrder": true
```

A special-order product can still have `"status": "out_of_stock"` if you don't currently have one. The dashboard will **not count it in the main out-of-stock alert**, because you do not need to keep it permanently in stock.

### Adding a product

Copy an existing product block, give it a unique `id`, change the details, and save.

### Removing a product

Delete its entire `{ ... }` block from the `products` array.

### Changing an image

Put an image into an `images` folder and use a relative path, for example:

```json
"image": "images/green-peel-herbs.jpg"
```

If `image` is blank, the site shows a simple placeholder.

### Products without prices

For items such as gauze masks and cotton pads where the source stock list did not give a price, `price` is currently `null`. These cannot be added to the order basket until you add a price.

## Order basket

Click **Add to order** on products you want to buy. The basket:

- keeps quantities
- calculates the total
- saves its current contents in the browser
- lets you copy the order text
- lets you download the order as a `.txt` file

It does **not** place an online order.

## Running locally

Because the website loads `products.json`, open it through a local web server rather than double-clicking `index.html`.

In VS Code / Codespaces:

```bash
python -m http.server 8000
```

Then open the forwarded port.

## Deploying

This is a plain static site, so it works with GitHub Pages, Netlify, Cloudflare Pages, etc.

There is no build step.

## Important distinction

The `size` / `quantity` column from the supplied stock list has been treated as the product's pack size (e.g. `500ml`, `2ml x21`, `100`), because the source file does not provide a separate number of units currently held.

If you later want actual stock counts, add:

```json
"stockQuantity": 3
```

to each product and the interface can be extended to track those separately.
