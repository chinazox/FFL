# Fresh Face Stock & Orders — NEW

## What this version does
- Uses the catalogue from `products.json` the first time the site is opened.
- Multiple categories per product.
- Three stock statuses: In stock, Running low, Out of stock.
- Separate **Special order** toggle. Special-order products can be out of stock without appearing in the dashboard's out-of-stock alerts.
- Professional and Retail prices/pack sizes.
- Add either Professional or Retail to the same order basket.
- Switch a basket line between Professional and Retail when both prices exist.
- Search and filter by range/category/status.
- Manage catalogue **inside the website**: add/edit products, add/delete unused categories, change prices, categories, pack sizes, stock status and special-order setting.
- Export the current catalogue as `products.json`.
- Generate copy-ready supplier order text or download it as `.txt`.
- Data is saved in the browser after the initial catalogue load.

## First setup in Codespaces
Put all four files in the same folder:
- `index.html`
- `styles.css`
- `app.js`
- `products.json`

Run:
`python -m http.server 8000`

Then open the forwarded port.

## Important workflow
You should NOT need to edit JavaScript for normal catalogue changes.

Use **Manage catalogue** in the website to add/edit products and ranges.

`products.json` is the starting/master catalogue. On the first load, it is copied into the browser. After that, the browser's saved catalogue is used. If you want to start again from the supplied `products.json`, clear the site's local storage or use a fresh browser profile.

The **Export catalogue** button downloads your current catalogue as a new `products.json` so you can keep a backup in GitHub.

## Initial catalogue
The initial catalogue is based on the stock sheet supplied in the conversation. Blank prices mean no price was provided in the sheet. The displayed stock statuses reflect the supplied screenshot. Special-order products are flagged separately and excluded from "out of stock" alerts.
