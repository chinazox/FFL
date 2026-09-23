# Fresh Face Lagos — Stock Manager

A lightweight, no-framework stock and ordering website. It is designed so the website itself does not need editing when products change: edit `products.json`, add product images to `images/`, and reload the site.

## Run locally

From this folder, use a local server (recommended because browsers may block `fetch()` when opening JSON directly):

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Changing products

Edit `products.json`. Each product has:

- `name`
- `range` — an array; add as many range/category labels as needed
- `size`
- `price` — use a number, or `null` if you do not currently order it at a listed price
- `status` — `In stock`, `Running low`, or `Out of stock`
- `specialOrder` — `true` means the product can be out of stock without appearing in the main out-of-stock action count
- `description`
- `id` — unique value, ideally lowercase with hyphens

## Images

The current build deliberately keeps the main inventory uncluttered. When you have a product image, put it in `images/` and the product detail view can be extended to display it. The data structure is already set up for that next step.

## Ordering

Add priced products to the basket, adjust quantities, then choose **Generate order**. The website creates copyable order text and a downloadable `.txt` order request. No online payment or external checkout is involved.
