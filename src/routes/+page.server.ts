import { env } from "$env/dynamic/private";
import { immichClient } from "$lib/api";
import type { PageServerLoad } from "./$types";

const IMMICH_ALBUM_ID = env.IMMICH_ALBUM_ID;

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
let cachedPhotos: ReturnType<typeof mapPhotos> | null = null;
let cacheExpiresAt = 0;

function mapPhotos(assets: Awaited<ReturnType<typeof immichClient.getAlbum>>["assets"]) {
  return assets.map((asset) => ({
    id: asset.id,
    url: `/api/image/${asset.id}`,
    description: asset.exifInfo?.description || null,
    date: asset.exifInfo?.dateTimeOriginal || asset.fileCreatedAt || null,
  }));
}

export const load: PageServerLoad = async () => {
  if (!IMMICH_ALBUM_ID) {
    return {
      photos: [],
      error: "missing_config",
    };
  }

  if (cachedPhotos && Date.now() < cacheExpiresAt) {
    return { photos: cachedPhotos, error: null };
  }

  try {
    const album = await immichClient.getAlbum(IMMICH_ALBUM_ID);
    cachedPhotos = mapPhotos(album.assets || []);
    cacheExpiresAt = Date.now() + CACHE_TTL_MS;

    return {
      photos: cachedPhotos,
      error: null,
    };
  } catch (err) {
    console.error("Error fetching Immich album:", err);
    return {
      photos: [],
      error: "fetch_failed",
    };
  }
};
