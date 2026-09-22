# Stock Manager

A lightweight static stock-management website for Fresh Face.

## Files you need to care about

### `data/products.json`
This is the main database for the website.

You can:
- change product names
- change ranges/categories
- change retail/professional prices
- change pack sizes
- change quantities
- change stock status
- mark retail or professional versions as `specialOrder`
- add products
- add optional product images

The website reads this file every time it loads.

## Stock statuses

Use exactly one of:

- `In Stock`
- `Running Low`
- `Out of Stock`

### Special order

`specialOrder: true` means you do not need to keep the product physically stocked.

A special-order product with zero quantity is therefore shown as **Special Order** on the website and is excluded from the main out-of-stock ordering alert.

You can set this separately for retail and professional.

## Adding a product

Copy this structure into the `products` array:

```json
{
  "id": "new-product-name",
  "name": "New Product",
  "ranges": ["Essential Range"],
  "image": "",
  "retail": {
    "size": "50ml",
    "price": 25,
    "quantity": 2,
    "status": "In Stock",
    "specialOrder": false
  },
  "professional": {
    "size": "125ml",
    "price": 40,
    "quantity": 1,
    "status": "In Stock",
    "specialOrder": false
  }
}
```

The `id` should be unique and should not contain spaces.

If a version of a product is not sold in that mode, use:

```json
"price": null
```

The website will show it as unavailable for that mode.

## Adding a range

You do not need to update a separate category list just to use a new range.

For example:

```json
"ranges": ["New Range"]
```

The website automatically picks up new ranges from the products file and adds them to the filter.

## Adding an image

Create this folder if it does not exist:

`assets/images/`

Put your image in it and set:

```json
"image": "assets/images/product-name.jpg"
```

If `image` is blank, the website automatically displays initials instead.

## Running locally

Because the website loads JSON with `fetch()`, don't open `index.html` by double-clicking it.

In Codespaces/your terminal:

```bash
python -m http.server 8000
```

Then open port 8000.

## Deployment

This is a static website, so it works with GitHub Pages, Netlify, Cloudflare Pages, or another static host.

There is no database or server required for this version.

## Important

The website is a stock/order management interface. It does not actually submit an order to the supplier. Checkout generates text that you can copy into an email or download as a `.txt` file.

The basket is saved in your browser using localStorage, so refreshing the page will not normally empty it.
