import {createBrowserSupabase} from '@/lib/supabase/browser';

export const MAX_BYTES = 10 * 1024 * 1024;
export const PHOTO_ACCEPT = 'image/jpeg,image/png,image/webp,image/avif';

const bucket = () => createBrowserSupabase().storage.from('gallery');

/** Uploads one photo to the public `gallery` bucket as the signed-in admin; returns where it went. */
export async function uploadGalleryPhoto(file: File, name: string) {
  const ext = (file.name.split('.').pop() ?? 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const path = `${name}.${ext}`;
  const storage = bucket();
  const {error} = await storage.upload(path, file, {contentType: file.type, cacheControl: '31536000'});
  if (error) throw new Error(error.message);
  return {path, url: storage.getPublicUrl(path).data.publicUrl};
}

/** Removes a file that was uploaded but did not end up in the gallery. */
export async function discardGalleryPhoto(path: string) {
  await bucket().remove([path]);
}
