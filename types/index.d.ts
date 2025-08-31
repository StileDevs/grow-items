import type { Collection } from "../lib/Collection";

export interface StringOptions {
  id?: number;
  encoded?: boolean;
}

export interface ItemDefinition {
  [key: string]: any;

  id?: number;
  flags?: number;
  type?: number;
  materialType?: number;
  name?: string;
  texture?: string;
  textureHash?: number;
  visualEffectType?: number;
  cookingTime?: number;
  textureX?: number;
  textureY?: number;
  storageType?: number;
  isStripeyWallpaper?: number;
  collisionType?: number;
  breakHits?: number;
  resetStateAfter?: number;
  bodyPartType?: number;
  blockType?: number;
  growTime?: number;
  rarity?: number;
  maxAmount?: number;
  extraFile?: string;
  extraFileHash?: number;
  audioVolume?: number;
  petName?: string;
  petPrefix?: string;
  petSuffix?: string;
  petAbility?: string;
  seedBase?: number;
  seedOverlay?: number;
  treeBase?: number;
  treeLeaves?: number;
  seedColor?: number;
  seedOverlayColor?: number;
  isMultiFace?: number;
  extraOptions?: string;
  texture2?: string;
  extraOptions2?: string;
  punchOptions?: string;
  extraBytes?: number[];
  tileRange?: number;
  vaultCapacity?: number;

  ingredient?: number;
  fxFlags?: number;
  flags2?: number;
  flags3?: number;
  bodyPart?: number[];
  lightRange?: number;
  canSit?: number;
  playerOffsetX?: number;
  playerOffsetY?: number;
  chairTextureX?: number;
  chairTextureY?: number;
  chairLegOffsetX?: number;
  chairLegOffsetY?: number;
  chairTexture?: string;
  itemRenderer?: string;
  unknownInt1?: number; // NOTE: not sure what this does
  unknownInt2?: number; // NOTE: not sure what this does
  unknownInt3?: number; // NOTE: not sure what this does
  unknownBytes1?: number[]; // NOTE: not sure what this does
  extraFlags1?: number; // NOTE: not sure what this does
  itemRendererHash?: number; // NOTE: not sure what this does
  unknownBytes2?: number[]; // NOTE: not sure what this does
  unknownShort1?: number; // NOTE: not sure what this does
  info?: string; // NOTE: not sure what this does
}

export interface ItemsDatMeta {
  version?: number;
  itemCount?: number;
  items: Collection<string, ItemDefinition>;
}
