# Project Overview

This is a Next.js application built with [Fumadocs](https://fumadocs.dev), designed to host documentation and content. It utilizes the Next.js App Router and allows for content management via MDX files.

## Tech Stack

*   **Framework:** Next.js 16
*   **Language:** TypeScript
*   **Documentation Engine:** Fumadocs (Core, MDX, UI)
*   **Styling:** Tailwind CSS 4
*   **Linting & Formatting:** Biome
*   **Package Manager:** Bun (inferred from `bun.lock`), though npm/yarn/pnpm are also supported.

## Directory Structure

*   **`app/`**: Contains the Next.js App Router application code.
    *   **`(home)/`**: Route group for the landing page.
    *   **`docs/`**: Route group for documentation pages.
    *   **`api/`**: API routes (e.g., search).
    *   **`og/`**: Open Graph image generation.
*   **`content/docs/`**: Stores the MDX files for the documentation content.
*   **`lib/`**: Shared utility libraries.
    *   `source.ts`: Configuration for the Fumadocs source adapter.
*   **`source.config.ts`**: Configuration for Fumadocs MDX processing.
*   **`biome.json`**: Configuration for the Biome linter and formatter.

## Getting Started

### Installation

Install dependencies using Bun (recommended) or your preferred package manager:

```bash
bun install
```

### Development

Start the development server:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

### Building

Build the application for production:

```bash
bun run build
bun run start
```

## Key Commands

These scripts are defined in `package.json`:

*   `dev`: Starts the development server.
*   `build`: Builds the application for production.
*   `start`: Starts the production server.
*   `types:check`: Runs type checking (Fumadocs MDX generation + Next.js typegen + TypeScript check).
*   `lint`: Checks code quality using Biome.
*   `format`: Formats code using Biome.

## Development Conventions

*   **Styling:** Use Tailwind CSS utility classes. Global styles are defined in `app/global.css`.
*   **Content:** Documentation content is written in MDX and located in `content/docs`.
*   **Linting:** The project uses Biome. Run `bun run lint` to check for issues and `bun run format` to fix formatting.
*   **Imports:** Clean imports are encouraged. The `tsconfig.json` likely supports path aliases (standard in Next.js).
