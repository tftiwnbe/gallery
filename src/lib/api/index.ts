import { env } from "$env/dynamic/private";

const IMMICH_URL = env.IMMICH_URL ?? "";
const IMMICH_API_KEY = env.IMMICH_API_KEY ?? "";

interface ImmichAsset {
  id: string;
  exifInfo?: {
    description?: string;
    dateTimeOriginal?: string;
  };
  fileCreatedAt?: string;
}

interface ImmichAlbum {
  id: string;
  albumName: string;
  assets: ImmichAsset[];
}

class ImmichClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "x-api-key": this.apiKey,
        Accept: "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Immich API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  async getAlbum(albumId: string): Promise<ImmichAlbum> {
    return this.request<ImmichAlbum>(`/api/albums/${albumId}`);
  }

  async getAssetThumbnail(
    assetId: string,
    size: "preview" | "thumbnail" = "preview",
  ): Promise<Response> {
    return fetch(
      `${this.baseUrl}/api/assets/${assetId}/thumbnail?size=${size}`,
      {
        headers: {
          "x-api-key": this.apiKey,
        },
      },
    );
  }
}

export const immichClient = new ImmichClient(IMMICH_URL, IMMICH_API_KEY);
