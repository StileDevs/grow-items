# grow-items

A standalone items.dat parser for Growtopia. This library allows you to read, modify and write Growtopia's items.dat files.

## Features

- Read/parse items.dat files
- Modify item properties (e.g. names, attributes)
- Encode modified data back to items.dat format
- Support for item metadata like version and item count

## Installation

```bash
npm install grow-items
```

## Usage

### Basic Example

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

Compatible with:

- CommonJS
- ESModule
- Browser (via CDN)

## License

MIT
