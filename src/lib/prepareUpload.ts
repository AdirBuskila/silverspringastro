/**
 * Browser-side photo preparation: shrinks large originals so uploads are quick and
 * storage lasts, and makes a thumbnail for the gallery grid. Re-encoding also drops
 * embedded metadata such as phone GPS location.
 */

const MAX_FULL_SIZE = 3000;
const MAX_THUMB_SIZE = 600;
const MAX_GIF_BYTES = 10 * 1024 * 1024;

export interface PreparedUpload {
  full: Blob;
  thumbnail: Blob;
  extension: 'jpg' | 'gif';
}

async function renderJpeg(bitmap: ImageBitmap, maxSize: number, quality: number): Promise<Blob> {
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext('2d');
  if (!context) throw new Error('This browser could not process the photo.');
  // JPEG has no transparency; a dark background suits the site if a PNG has any.
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('This browser could not process the photo.'))),
      'image/jpeg',
      quality,
    );
  });
}

export async function prepareUpload(file: File): Promise<PreparedUpload> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error(
      `"${file.name}" can't be read here. Please use a JPG or PNG. Photos from iPhones (HEIC) and TIFF files need to be saved as JPG first.`,
    );
  }

  try {
    const thumbnail = await renderJpeg(bitmap, MAX_THUMB_SIZE, 0.85);

    // Re-encoding would freeze an animation, so GIFs (asteroid motion) are kept as they are.
    if (file.type === 'image/gif') {
      if (file.size > MAX_GIF_BYTES) throw new Error('GIF files can be at most 10 MB.');
      return { full: file, thumbnail, extension: 'gif' };
    }

    return { full: await renderJpeg(bitmap, MAX_FULL_SIZE, 0.92), thumbnail, extension: 'jpg' };
  } finally {
    bitmap.close();
  }
}

/** The storage path inside the images bucket for one of its public URLs. */
export function storagePathFromUrl(url: string): string | null {
  const marker = '/storage/v1/object/public/images/';
  const index = url.indexOf(marker);
  return index === -1 ? null : decodeURIComponent(url.slice(index + marker.length));
}
