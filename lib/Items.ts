import type { ItemDefinition, ItemsDatMeta, StringOptions } from "../types";
import { ExtendBuffer } from "./ExtendBuffer";

export class ItemsDat {
  public buffer: ExtendBuffer;
  private key: string = "PBG892FXX982ABC*";
  private stringFields: string[] = [
    "name",
    "texture",
    "extraFile",
    "petName",
    "petPrefix",
    "petSuffix",
    "petAbility",
    "extraOptions",
    "texture2",
    "extraOptions2",
    "punchOptions",
    "chairTexture",
    "itemRenderer",
    "info"
  ];

  public meta: ItemsDatMeta = {
    items: [],
    itemCount: 0,
    version: 0
  };

  constructor(data: number[] | number) {
    this.buffer = new ExtendBuffer(data);
  }

  public getWriteSize(items: ItemDefinition[]) {
    let size = 130 * items.length;

    for (const item of items) {
      const keys = Object.keys(item);

      for (const key of keys) {
        const strValue = item[key] as unknown as string;
        if (this.stringFields.includes(key) && typeof strValue === "string") {
          size += strValue.length + 2;
        }
        if (typeof item[key] === "object") {
          const numArray = item[key] as unknown as number[];
          size += numArray.length;
        }
      }
    }

    return size + 4 + 2;
  }

  public async decode() {
    this.buffer.mempos = 0;
    this.meta.version = this.buffer.readU16();
    this.meta.itemCount = this.buffer.readI32();

    for (let i = 0; i < this.meta.itemCount; i++) {
      const item: ItemDefinition = {};

      item.id = this.buffer.readI32();
      item.flags = this.buffer.readU16();
      item.type = this.buffer.readU8();
      item.materialType = this.buffer.readU8();

      item.name = await this.readString({ id: item.id, encoded: true });
      item.texture = await this.readString({ id: item.id });

      item.textureHash = this.buffer.readI32();
      item.visualEffectType = this.buffer.readU8();
      item.cookingTime = this.buffer.readI32();

      item.textureX = this.buffer.readU8();
      item.textureY = this.buffer.readU8();
      item.storageType = this.buffer.readU8();
      item.isStripeyWallpaper = this.buffer.readU8();
      item.collisionType = this.buffer.readU8();
      item.breakHits = this.buffer.readU8() / 6;

      item.resetStateAfter = this.buffer.readI32();
      item.bodyPartType = this.buffer.readU8();
      item.rarity = this.buffer.readI16();
      item.maxAmount = this.buffer.readU8();

      item.extraFile = await this.readString({ id: item.id });
      item.extraFileHash = this.buffer.readI32();
      item.audioVolume = this.buffer.readI32();

      item.petName = await this.readString({ id: item.id });
      item.petPrefix = await this.readString({ id: item.id });
      item.petSuffix = await this.readString({ id: item.id });
      item.petAbility = await this.readString({ id: item.id });

      item.seedBase = this.buffer.readU8();
      item.seedOverlay = this.buffer.readU8();
      item.treeBase = this.buffer.readU8();
      item.treeLeaves = this.buffer.readU8();

      item.seedColor = this.buffer.readI32();
      item.seedOverlayColor = this.buffer.readI32();
      item.ingredient = this.buffer.readI32();
      item.growTime = this.buffer.readI32();

      item.fxFlags = this.buffer.readI32();

      item.extraOptions = await this.readString({ id: item.id });
      item.texture2 = await this.readString({ id: item.id });
      item.extraOptions2 = await this.readString({ id: item.id });

      item.unknownInt1 = this.buffer.readI32();
      item.unknownInt2 = this.buffer.readI32();
      item.flags2 = this.buffer.readI32();

      item.extraBytes = this.buffer.data.slice(this.buffer.mempos, (this.buffer.mempos += 60));

      item.tileRange = this.buffer.readI32();
      item.vaultCapacity = this.buffer.readI32();

      if (this.meta.version >= 11) {
        item.punchOptions = await this.readString({ id: item.id });

        if (this.meta.version >= 12) {
          item.flags3 = this.buffer.readI32();
          item.bodyPart = this.buffer.data.slice(this.buffer.mempos, (this.buffer.mempos += 9));
        }
        if (this.meta.version >= 13) item.lightRange = this.buffer.readI32();
        if (this.meta.version >= 14) item.unknownInt3 = this.buffer.readI32();
        if (this.meta.version >= 15) {
          item.canSit = this.buffer.readU8();
          item.playerOffsetX = this.buffer.readI32();
          item.playerOffsetY = this.buffer.readI32();

          item.chairTextureX = this.buffer.readI32();
          item.chairTextureY = this.buffer.readI32();

          item.chairLegOffsetX = this.buffer.readI32();
          item.chairLegOffsetY = this.buffer.readI32();

          item.chairTexture = await this.readString({ id: item.id });
        }
        if (this.meta.version >= 16) item.itemRenderer = await this.readString({ id: item.id });
        if (this.meta.version >= 17) item.extraFlags1 = this.buffer.readI32();
        if (this.meta.version >= 18) item.itemRendererHash = this.buffer.readI32();
        if (this.meta.version >= 19) item.unknownBytes2 = this.buffer.data.slice(this.buffer.mempos, (this.buffer.mempos += 9));
        if (this.meta.version! >= 21) item.unknownShort1 = this.buffer.readI16();
        if (this.meta.version! >= 22) item.info = await this.readString({ id: item.id });
      }

      this.meta.items.push(item);
    }
  }

  public async encode() {
    this.buffer.mempos = 0;
    const size = this.getWriteSize(this.meta.items);

    this.buffer = new ExtendBuffer(size);
    this.buffer.writeI16(this.meta.version!);
    this.buffer.writeI32(this.meta.items.length);

    for (const item of this.meta.items) {
      this.buffer.writeI32(item.id!);
      this.buffer.writeU16(item.flags!);
      this.buffer.writeU8(item.type!);
      this.buffer.writeU8(item.materialType!);

      await this.writeString(item.name!, item.id!, true);
      await this.writeString(item.texture!, item.id!);

      this.buffer.writeI32(item.textureHash!);
      this.buffer.writeU8(item.visualEffectType!);
      this.buffer.writeI32(item.cookingTime!);

      this.buffer.writeU8(item.textureX!);
      this.buffer.writeU8(item.textureY!);
      this.buffer.writeU8(item.storageType!);
      this.buffer.writeU8(item.isStripeyWallpaper!);
      this.buffer.writeU8(item.collisionType!);
      this.buffer.writeU8(item.breakHits! * 6);

      this.buffer.writeI32(item.resetStateAfter!);
      this.buffer.writeU8(item.bodyPartType!);
      this.buffer.writeI16(item.rarity!);
      this.buffer.writeU8(item.maxAmount!);

      await this.writeString(item.extraFile!, item.id!);
      this.buffer.writeI32(item.extraFileHash!);
      this.buffer.writeI32(item.audioVolume!);

      await this.writeString(item.petName!, item.id!);
      await this.writeString(item.petPrefix!, item.id!);
      await this.writeString(item.petSuffix!, item.id!);
      await this.writeString(item.petAbility!, item.id!);

      this.buffer.writeU8(item.seedBase!);
      this.buffer.writeU8(item.seedOverlay!);
      this.buffer.writeU8(item.treeBase!);
      this.buffer.writeU8(item.treeLeaves!);

      this.buffer.writeI32(item.seedColor!);
      this.buffer.writeI32(item.seedOverlayColor!);
      this.buffer.writeI32(item.ingredient!);
      this.buffer.writeI32(item.growTime!);

      this.buffer.writeI32(item.fxFlags!);

      await this.writeString(item.extraOptions!, item.id!);
      await this.writeString(item.texture2!, item.id!);
      await this.writeString(item.extraOptions2!, item.id!);

      this.buffer.writeI32(item.unknownInt1!);
      this.buffer.writeI32(item.unknownInt2!);
      this.buffer.writeI32(item.flags2!);

      if (item.extraBytes) {
        for (const byte of item.extraBytes) {
          this.buffer.writeU8(byte);
        }
      }

      this.buffer.writeI32(item.tileRange!);
      this.buffer.writeI32(item.vaultCapacity!);

      if (this.meta.version! >= 11) {
        await this.writeString(item.punchOptions || "", item.id!);

        if (this.meta.version! >= 12) {
          this.buffer.writeI32(item.flags3!);
          if (item.bodyPart) {
            for (const byte of item.bodyPart) {
              this.buffer.writeU8(byte);
            }
          }
        }
        if (this.meta.version! >= 13) this.buffer.writeI32(item.lightRange!);
        if (this.meta.version! >= 14) this.buffer.writeI32(item.unknownInt3!);
        if (this.meta.version! >= 15) {
          this.buffer.writeU8(item.canSit!);
          this.buffer.writeI32(item.playerOffsetX!);
          this.buffer.writeI32(item.playerOffsetY!);

          this.buffer.writeI32(item.chairTextureX!);
          this.buffer.writeI32(item.chairTextureY!);

          this.buffer.writeI32(item.chairLegOffsetX!);
          this.buffer.writeI32(item.chairLegOffsetY!);

          await this.writeString(item.chairTexture || "", item.id!);
        }
        if (this.meta.version! >= 16) {
          await this.writeString(item.itemRenderer || "", item.id!);
        }
        if (this.meta.version! >= 17) this.buffer.writeI32(item.extraFlags1!);
        if (this.meta.version! >= 18) this.buffer.writeI32(item.itemRendererHash!);
        if (this.meta.version! >= 19) {
          if (item.unknownBytes2) {
            for (const byte of item.unknownBytes2) {
              this.buffer.writeU8(byte);
            }
          }
        }
        if (this.meta.version! >= 21) this.buffer.writeI16(item.unknownShort1!);
        if (this.meta.version! >= 22) this.writeString(item.info!, item.id!);
      }
    }
  }

  private async readString(opts: StringOptions = { encoded: false }): Promise<string> {
    const len = this.buffer.readI16();

    if (!opts.encoded) {
      const chars = [];
      for (let i = 0; i < len; i++) {
        chars.push(String.fromCharCode(this.buffer.data[this.buffer.mempos++]));
      }
      return chars.join("");
    } else {
      const chars = [];
      for (let i = 0; i < len; i++) {
        chars.push(String.fromCharCode(this.buffer.data[this.buffer.mempos] ^ this.key.charCodeAt((opts.id! + i) % this.key.length)));
        this.buffer.mempos++;
      }
      return chars.join("");
    }
  }

  private async writeString(str: string, id: number, encoded: boolean = false): Promise<void> {
    this.buffer.writeI16(str.length);

    if (!encoded) {
      for (let i = 0; i < str.length; i++) {
        this.buffer.writeU8(str.charCodeAt(i));
      }
    } else {
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i) ^ this.key.charCodeAt((i + id) % this.key.length);
        this.buffer.writeU8(char);
      }
    }
  }
}
