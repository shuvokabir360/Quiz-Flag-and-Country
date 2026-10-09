import fs from 'fs';
import zlib from 'zlib';

function createPNG(size, primaryColor, secondaryColor) {
  const width = size;
  const height = size;

  // Raw uncompressed RGBA pixel buffer: (1 byte filter + width * 4 bytes) per row
  const rowBytes = 1 + width * 4;
  const buffer = Buffer.alloc(height * rowBytes);

  const cx = width / 2;
  const cy = height / 2;
  const r = width * 0.42;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    buffer[rowOffset] = 0; // Filter type: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Deep space background with subtle rounded border
      if (dist <= r) {
        // Globe circle with glowing gradient
        const t = (x + y) / (width + height);
        // Blend from amber-gold to deep violet
        const red = Math.round(245 * (1 - t) + 120 * t);
        const green = Math.round(158 * (1 - t) + 40 * t);
        const blue = Math.round(11 * (1 - t) + 240 * t);
        buffer[pxOffset] = red;
        buffer[pxOffset + 1] = green;
        buffer[pxOffset + 2] = blue;
        buffer[pxOffset + 3] = 255;
      } else if (dist <= r + 4) {
        // Glowing cyan outer ring
        buffer[pxOffset] = 56;
        buffer[pxOffset + 1] = 189;
        buffer[pxOffset + 2] = 248;
        buffer[pxOffset + 3] = 255;
      } else {
        // Dark theme background #070913
        buffer[pxOffset] = 7;
        buffer[pxOffset + 1] = 9;
        buffer[pxOffset + 2] = 19;
        buffer[pxOffset + 3] = 255;
      }
    }
  }

  // Deflate pixel data
  const compressedData = zlib.deflateSync(buffer);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // Helper to build chunk: length (4) + type (4) + data + crc (4)
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);

    const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(crc32(typeAndData), 0);

    return Buffer.concat([len, typeAndData, crc]);
  }

  // IHDR chunk: width(4), height(4), bitDepth(1)=8, colorType(1)=6(RGBA), comp(1)=0, filter(1)=0, interlace(1)=0
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8;
  ihdrData[9] = 6;
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT chunk
  const idatChunk = makeChunk('IDAT', compressedData);

  // IEND chunk
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// CRC32 table & calculation
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    if (c & 1) c = 0xedb88320 ^ (c >>> 1);
    else c = c >>> 1;
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

fs.writeFileSync('public/icon-192.png', createPNG(192));
fs.writeFileSync('public/icon-512.png', createPNG(512));
console.log('Successfully generated public/icon-192.png and public/icon-512.png');
