const test = require("ava");
const { readFileSync } = require("fs");
const { ItemsDat } = require("../dist/index.mjs");
const file = readFileSync("./assets/items.dat");
const fileArr = [...file];

/**
 * @type {import("../dist/index").ItemsDat}
 */
let itemsDat;

test.serial("initialize the items.dat (is exist)", (t) => {
  itemsDat = new ItemsDat(fileArr);
  t.is(itemsDat instanceof ItemsDat, true);
});

test.serial(
  "file & itemsdat object has same bytes size (should match)",
  (t) => {
    t.log("file length:", file.length);
    t.log("itemsDat buffer length:", itemsDat.buffer.data.length);
    t.is(file.length, itemsDat.buffer.data.length);
  },
);

test.serial("itemsDat decode test", async (t) => {
  try {
    await itemsDat.decode();
    t.log("Buffer position after decode:", itemsDat.buffer.mempos);
    t.log("Buffer total length:", itemsDat.buffer.data.length);

    t.is(itemsDat.buffer.mempos, itemsDat.buffer.data.length);
  } catch (err) {
    t.fail(`Decode failed: ${err.message}`);
  }
});

test.serial("itemsDat meta version test (more than 1)", (t) => {
  const version = itemsDat.meta.version;

  t.log("ItemsDat meta version:", version);

  t.is(version >= 1, true, "ItemsDat version be at least 1");
});

test.serial("itemsDat meta itemCount test (more than 1)", (t) => {
  const count = itemsDat.meta.itemCount;

  t.log("ItemsDat meta itemCount:", count);

  t.is(count >= 1, true, "ItemDat itemCount should be at least 1");
});

test.serial("itemsDat meta items size test (more than 1)", (t) => {
  t.log("ItemsDat items size:", itemsDat.meta.items.size);
  t.is(
    itemsDat.meta.items.size >= 1,
    true,
    "ItemsDat items should have at least one item",
  );
});

test.serial("itemsDat meta modify item test (check condition)", async (t) => {
  const dirt = itemsDat.meta.items.get(2);
  const itemModifyName = "Super Dirt";

  t.log("Original dirt name:", dirt.name);

  const modifiedDirt = { ...dirt, name: itemModifyName };
  itemsDat.meta.items.set(2, modifiedDirt);
  const updatedDirt = itemsDat.meta.items.get(2);
  t.log("Modified dirt name:", updatedDirt.name);

  t.is(
    updatedDirt.name,
    itemModifyName,
    "ItemDat name should be modified to 'Super Dirt'",
  );
});

test.serial("itemsDat encode test", async (t) => {
  try {
    await itemsDat.encode();
    t.log("Item Write Size:", itemsDat.getWriteSize(itemsDat.meta.items));
    t.log("Buffer position after encode:", itemsDat.buffer.mempos);
    t.log("Buffer total length after encode:", itemsDat.buffer.data.length);

    t.is(
      itemsDat.buffer.mempos,
      itemsDat.buffer.data.length,
      "Buffer position should match total length after encoding",
    );
  } catch (err) {
    t.fail(`Encode failed: ${err.message}`);
  }
});

test.serial("itemsDat compare with original file (should not match)", (t) => {
  const encodedFile = itemsDat.buffer.data;

  t.log("Encoded file length:", encodedFile.length);
  t.log("Original file length:", file.length);

  t.not(
    encodedFile.length,
    file.length,
    "Encoded file should not match original file size",
  );
});
