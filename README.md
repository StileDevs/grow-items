# grow-items

A standalone items.dat parser for Growtopia. This library allows you to read, modify and write Growtopia's items.dat files.

## Features

- Read/parse items.dat files
- Modify item properties (e.g. names, attributes)
- Encode modified data back to items.dat format
- Support for item metadata like version and item count

## Installation

### Node.js

```bash
npm install grow-items
```

### Browser via CDN

#### jsDelivr

```html
<!-- Global build -->
<script src="https://cdn.jsdelivr.net/npm/grow-items@latest/dist/index.global.js"></script>

<!-- ES Module -->
<script type="module">
  import { ItemsDat } from "https://cdn.jsdelivr.net/npm/grow-items@latest/dist/index.mjs";
</script>
```

#### UNPKG

```html
<!-- Global build -->
<script src="https://unpkg.com/grow-items@latest/dist/index.global.js"></script>

<!-- ES Module -->
<script type="module">
  import { ItemsDat } from "https://unpkg.com/grow-items@latest/dist/index.mjs";
</script>
```

## Usage

### Node.js Example

```javascript
import { ItemsDat } from "grow-items";
import { readFileSync } from "fs";

// Read items.dat file
const file = readFileSync("./items.dat");
const fileArr = [...file];

// Create ItemsDat instance
const itemsDat = new ItemsDat(fileArr);

// Decode the data
await itemsDat.decode();

// Access metadata
console.log("Version:", itemsDat.meta.version);
console.log("Item Count:", itemsDat.meta.itemCount);

// Modify an item
const dirt = itemsDat.meta.items[2];
dirt.name = "Super Dirt";

// Encode modified data
await itemsDat.encode();
```

### Browser Example

```javascript
// Raw Data
const fileArr = Array.from(new Uint8Array([1, 0, 0, 0]));

// Create ItemsDat instance
const itemsDat = new growItems.ItemsDat(fileArr);

// Decode the data
await itemsDat.decode();

// Access metadata
console.log("Version:", itemsDat.meta.version);
console.log("Item Count:", itemsDat.meta.itemCount);

// Modify an item
const dirt = itemsDat.meta.items[2];
dirt.name = "Super Dirt";

// Encode modified data
await itemsDat.encode();
```

## API

### `ItemsDat`

Main class for handling items.dat files.

#### Constructor

- `new ItemsDat(fileArray)` - Creates new instance with file data

#### Methods

- `decode()` - Parses the items.dat file data
- `encode()` - Converts modified data back to items.dat format

#### Properties

- `meta.version` - items.dat version number
- `meta.itemCount` - Total number of items
- `meta.items` - Array of item objects that can be modified

## Module Formats

The library is available in multiple formats:

- CommonJS (Node.js) - `require('grow-items')`
- ES Modules - `import { ItemsDat } from 'grow-items'`
- Browser Global - `window.growItems`

## License

MIT
