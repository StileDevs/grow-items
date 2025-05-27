export class ExtendBuffer {
  public data: number[];

  constructor(data: number[] | number, public mempos = 0) {
    this.data = Array.isArray(data) ? data : new Array(data).fill(0);
  }

  private read(size: number): number {
    let value = 0;
    for (let i = 0; i < size; i++) {
      value |= this.data[this.mempos + i] << (i * 8);
    }
    this.mempos += size;
    return value >>> 0;
  }

  private readSigned(size: number): number {
    let value = this.read(size);
    const bits = size * 8;
    if (value & (1 << (bits - 1))) {
      value = value - (1 << bits);
    }
    return value;
  }

  private write(value: number, size: number): void {
    for (let i = 0; i < size; i++) {
      this.data[this.mempos + i] = (value >> (i * 8)) & 0xff;
    }
    this.mempos += size;
  }

  public readU8 = () => this.read(1);
  public readU16 = (be = false) => (be ? this.readBE(2) : this.read(2));
  public readU32 = (be = false) => (be ? this.readBE(4) : this.read(4));

  public readI8 = () => this.readSigned(1);
  public readI16 = (be = false) => (be ? this.readSignedBE(2) : this.readSigned(2));
  public readI32 = (be = false) => (be ? this.readSignedBE(4) : this.readSigned(4));

  private readBE(size: number): number {
    let value = 0;
    for (let i = 0; i < size; i++) {
      value = (value << 8) | this.data[this.mempos + i];
    }
    this.mempos += size;
    return value >>> 0;
  }

  private readSignedBE(size: number): number {
    let value = this.readBE(size);
    const bits = size * 8;
    if (value & (1 << (bits - 1))) {
      value = value - (1 << bits);
    }
    return value;
  }

  public writeU8 = (value: number) => this.write(value, 1);
  public writeU16 = (value: number, be = false) => (be ? this.writeBE(value, 2) : this.write(value, 2));
  public writeU32 = (value: number, be = false) => (be ? this.writeBE(value, 4) : this.write(value, 4));

  public writeI8 = (value: number) => this.write(value, 1);
  public writeI16 = (value: number, be = false) => (be ? this.writeBE(value, 2) : this.write(value, 2));
  public writeI32 = (value: number, be = false) => (be ? this.writeBE(value, 4) : this.write(value, 4));

  private writeBE(value: number, size: number): void {
    for (let i = 0; i < size; i++) {
      this.data[this.mempos + i] = (value >> ((size - 1 - i) * 8)) & 0xff;
    }
    this.mempos += size;
  }

  public writeU = (size: number, value: number, be = false) => {
    const methods = { 1: this.writeU8, 2: this.writeU16, 4: this.writeU32 };
    methods[size as 1 | 2 | 4](value, be);
  };

  public writeI = (size: number, value: number, be = false) => {
    const methods = { 1: this.writeI8, 2: this.writeI16, 4: this.writeI32 };
    methods[size as 1 | 2 | 4](value, be);
  };

  public async readString(be = false) {
    const len = be ? this.readBE(2) : this.read(2);
    const chars = this.data.slice(this.mempos, this.mempos + len);
    this.mempos += len;
    return String.fromCharCode(...chars);
  }

  public async writeString(str: string, be = false) {
    const bytes = str.split("").map((char) => char.charCodeAt(0));
    be ? this.writeBE(str.length, 2) : this.write(str.length, 2);
    for (const byte of bytes) {
      this.data[this.mempos++] = byte;
    }
  }
}
