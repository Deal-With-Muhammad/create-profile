const OUTPUT_SIZE = 640;
/** Compressed photos are stored in the browser; keep each one small. */
const MAX_OUTPUT_BYTES = 200 * 1024;
const QUALITY_STEPS = [0.88, 0.8, 0.72, 0.64];
/** Guards against decoding something absurd into memory. */
const MAX_INPUT_BYTES = 50 * 1024 * 1024;

const HEIC_EXTENSIONS = /\.(heic|heif)$/i;
const HEIC_BRANDS = new Set([
  "heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs", "mif1", "msf1",
]);

/**
 * Reads the ISO-BMFF "ftyp" brand at bytes 8-12. Windows/Chrome often report
 * an empty MIME type for HEIC, so the extension and type can't be trusted.
 */
async function looksLikeHeic(file: File): Promise<boolean> {
  if (HEIC_EXTENSIONS.test(file.name) || /image\/hei[cf]/.test(file.type)) {
    return true;
  }
  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const box = String.fromCharCode(...header.slice(4, 8));
  const brand = String.fromCharCode(...header.slice(8, 12));
  return box === "ftyp" && HEIC_BRANDS.has(brand);
}

async function decode(file: File): Promise<ImageBitmap> {
  try {
    // Safari decodes HEIC natively, so this covers most iPhone users too.
    return await createImageBitmap(file);
  } catch {
    if (!(await looksLikeHeic(file))) {
      throw new Error(
        "That doesn't look like a photo we can read. Please use JPG, PNG or HEIC.",
      );
    }
  }

  // ~3MB of WebAssembly, so only fetched when someone actually uploads HEIC.
  const { heicTo } = await import("heic-to");
  try {
    return await heicTo({ blob: file, type: "bitmap" });
  } catch {
    throw new Error("This HEIC photo couldn't be converted. Please try a JPG.");
  }
}

function dataUrlBytes(dataUrl: string): number {
  return Math.ceil(((dataUrl.length - dataUrl.indexOf(",") - 1) * 3) / 4);
}

/**
 * Turns any supported image (JPG, PNG, WebP, HEIC, ...) into a small square
 * JPEG data URL.
 *
 * The PDF renderer only understands JPEG and PNG, and phone photos are often
 * 4000px+ and several MB, so every upload is normalised here regardless of
 * its original size: cropped to a square (biased towards the top for
 * portraits, where faces usually are), downscaled to 640px, flattened onto
 * white so transparent PNGs don't turn black, and re-encoded at the highest
 * quality that stays under MAX_OUTPUT_BYTES.
 */
export async function photoToDataUrl(file: File): Promise<string> {
  // No MIME check: HEIC often arrives as "" or application/octet-stream.
  // decode() decides by actually reading the file.
  if (file.size > MAX_INPUT_BYTES) {
    throw new Error("That file is over 50MB. Please choose a smaller photo.");
  }

  const bitmap = await decode(file);

  const side = Math.min(bitmap.width, bitmap.height);
  const sx = (bitmap.width - side) / 2;
  const sy = bitmap.height > bitmap.width ? (bitmap.height - side) * 0.25 : 0;

  const size = Math.min(OUTPUT_SIZE, side);
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process the image.");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, size, size);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, size, size);
  bitmap.close();

  let dataUrl = "";
  for (const quality of QUALITY_STEPS) {
    dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrlBytes(dataUrl) <= MAX_OUTPUT_BYTES) break;
  }
  return dataUrl;
}
