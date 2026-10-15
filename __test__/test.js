const { readFileSync } = require("fs");

const { ItemsDat } = require("../dist/index.mjs");
const file = readFileSync("./assets/items.dat");
const fileArr = [...file];

const itemsDat = new ItemsDat(fileArr);

(async () => {
  await itemsDat.decode();
  console.log(itemsDat);
})();
