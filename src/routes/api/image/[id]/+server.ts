import { immichClient } from "$lib/api";
import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const { id } = params;

  if (!id) {
    throw error(400, "Missing asset ID");
  }

  let response: Response;
  try {
    response = await immichClient.getAssetThumbnail(id);
  } catch (err) {
    console.error("Error proxying image:", err);
    throw error(500, "Failed to load image");
  }

  if (!response.ok) {
    throw error(response.status, "Failed to fetch image");
  }

  const imageBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/jpeg";

  return new Response(imageBuffer, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
