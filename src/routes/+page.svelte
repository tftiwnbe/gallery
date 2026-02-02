<script lang="ts">
  import type { PageData } from "./$types";
  import {
    getEffectiveTheme,
    initializeTheme,
    setupThemeListener,
    toggleTheme,
    type Theme,
  } from "$lib/utils/theme";
  import { MoonIcon, SunIcon } from "@lucide/svelte/icons";
  import { onMount } from "svelte";

  let { data }: { data: PageData } = $props();
  let themeOverride = $state<Theme | null>(null);
  let currentTheme = $state<Theme>("dark");

  onMount(() => {
    themeOverride = initializeTheme();
    currentTheme = getEffectiveTheme();

    const cleanup = setupThemeListener(() => {
      themeOverride = themeOverride;
      currentTheme = getEffectiveTheme();
    });

    return cleanup;
  });

  function handleToggleTheme() {
    themeOverride = toggleTheme();
    currentTheme = getEffectiveTheme();
  }

  function formatDate(dateString: string | null): string | null {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return null;
    }
  }
</script>

<div class="min-h-screen bg-background">
  <div class="fixed top-0 left-0 right-0 z-10 pointer-events-none">
    <div class="flex items-start justify-between p-6">
      <h1
        class="text-lg font-semibold pointer-events-auto bg-background/80 backdrop-blur-sm px-3 py-2 rounded-md"
      >
        Gallery
      </h1>
      <button
        onclick={handleToggleTheme}
        class="p-2 rounded-md hover:bg-accent transition-colors pointer-events-auto bg-background/80 backdrop-blur-sm"
        aria-label="Toggle theme"
      >
        {#if currentTheme === "dark"}
          <SunIcon class="size-5" />
        {:else}
          <MoonIcon class="size-5" />
        {/if}
      </button>
    </div>
  </div>

  <div class="h-screen overflow-y-auto snap-y snap-mandatory">
    <div class="px-4 py-80">
      {#if data.error}
        <div class="flex items-center justify-center min-h-screen snap-center">
          <div class="text-center space-y-2">
            <p class="text-lg font-medium text-destructive">
              {#if data.error === "missing_config"}
                Album not configured
              {:else if data.error === "fetch_failed"}
                Failed to load photos
              {:else}
                Something went wrong
              {/if}
            </p>
            <p class="text-sm text-muted-foreground">
              {#if data.error === "missing_config"}
                Please configure IMMICH_ALBUM_ID in your environment
              {:else}
                Please try again later
              {/if}
            </p>
          </div>
        </div>
      {:else if data.photos.length === 0}
        <div class="flex items-center justify-center min-h-screen snap-center">
          <p class="text-muted-foreground">No photos found</p>
        </div>
      {:else}
        <div class="space-y-8">
          {#each data.photos as photo, index (photo.id)}
            <div class="snap-center space-y-4">
              <div class="flex items-center justify-center">
                <img
                  src={photo.url}
                  alt={photo.description || "Photo"}
                  class="w-full h-auto max-h-[80vh] object-contain"
                  loading="lazy"
                />
              </div>
              <div class="max-w-6xl mx-auto space-y-1 px-1">
                {#if formatDate(photo.date)}
                  <p class="text-xs text-muted-foreground">
                    {formatDate(photo.date)}
                  </p>
                {/if}
                {#if photo.description}
                  <p class="text-sm text-foreground">{photo.description}</p>
                {/if}
              </div>
            </div>
            {#if index < data.photos.length - 1}
              <hr class="border-t border-border max-w-7xl mx-auto" />
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>
