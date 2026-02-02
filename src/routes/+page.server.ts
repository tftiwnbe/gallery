import { IMMICH_ALBUM_ID } from "$env/static/private";
import { immichClient } from "$lib/api";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  if (!IMMICH_ALBUM_ID) {
    return {
      photos: [],
      error: "missing_config",
    };
  }

  try {
    const album = await immichClient.getAlbum(IMMICH_ALBUM_ID);
    const assets = album.assets || [];

    const photos = assets.map((asset) => ({
      id: asset.id,
      url: `/api/image/${asset.id}`,
      description: asset.exifInfo?.description || null,
      date: asset.exifInfo?.dateTimeOriginal || asset.fileCreatedAt || null,
    }));

    return {
      photos,
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
