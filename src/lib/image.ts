const OUTPUT_SIZE = 640;

/**
 * Turns any browser-decodable image into a square JPEG data URL.
 *
 * The PDF renderer only understands JPEG and PNG, and phone photos are often
 * 4000px+, so every upload is normalised here: cropped to a square (biased
 * towards the top for portraits, where faces usually are), downscaled, and
 * flattened onto white so transparent PNGs don't turn black.
 */
export async function photoToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG or PNG).");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(
      "This image format isn't supported by your browser. Please use JPG or PNG.",
    );
  }

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

  return canvas.toDataURL("image/jpeg", 0.88);
}
