# Gallery

A self-hosted photo gallery powered by [Immich](https://immich.app). Displays a single album as a clean, minimal gallery with light/dark theme support.

## Requirements

- An Immich instance with at least one album
- An Immich API key
- Docker (for production) or Node.js 20+ (for development)

## Configuration

All configuration is done via environment variables:

| Variable          | Description                         | Example                    |
| ----------------- | ----------------------------------- | -------------------------- |
| `IMMICH_URL`      | Base URL of your Immich instance    | `http://192.168.1.10:2283` |
| `IMMICH_API_KEY`  | Immich API key (Profile → API Keys) | `abc123...`                |
| `IMMICH_ALBUM_ID` | ID of the album to display          | `uuid-of-album`            |

Copy `.env.example` to `.env` and fill in the values.

## Running with Docker Compose

```yaml
# compose.yaml — set IMMICH_API_KEY and IMMICH_ALBUM_ID before starting
```

```sh
IMMICH_API_KEY=your_key IMMICH_ALBUM_ID=your_album_id docker compose up -d
```

Or edit `compose.yaml` directly and run:

```sh
docker compose up -d
```

The gallery will be available at `http://localhost:3000`.

> **Note:** `IMMICH_URL` in `compose.yaml` defaults to `http://host.docker.internal:2283`, which reaches a service running on the host machine. Change this if your Immich instance is elsewhere.

## Running with Docker

```sh
docker build -t gallery .
docker run -p 3000:3000 \
  -e IMMICH_URL=http://your-immich-host:2283 \
  -e IMMICH_API_KEY=your_key \
  -e IMMICH_ALBUM_ID=your_album_id \
  gallery
```

## Development

```sh
# Install dependencies
pnpm install

# Copy and fill in environment variables
cp .env.example .env

# Start dev server
pnpm dev
```

Other commands:

```sh
pnpm check    # TypeScript + Svelte type check
pnpm lint     # ESLint
pnpm format   # Prettier
pnpm build    # Production build
```

## Deployment

The Docker image is built and pushed to GHCR automatically on version tags:

```sh
git tag v1.0.0
git push --tags
```

Images are published to `ghcr.io/<owner>/gallery:<version>`.
