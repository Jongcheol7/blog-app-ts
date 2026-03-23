# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 (App Router) + React 19 + TypeScript blog platform with Prisma ORM (PostgreSQL), NextAuth authentication, TanStack Query, and Tiptap rich text editor.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Generate Prisma client + Next.js build
npm run start     # Production server
npm run lint      # ESLint
npx prisma generate          # Regenerate Prisma client after schema changes
npx prisma migrate dev       # Apply database migrations in development
npx prisma db push           # Push schema changes without migration files
```

## Architecture

### Routing (App Router)

Route groups organize pages: `(blog)`, `(about)`, `(admin)`, `(guestbook)`. Home (`/`) redirects to `/blog`.

- `/blog` — Blog list with infinite scroll (cursor-based pagination)
- `/blog/write` and `/blog/edit/[id]` — Blog creation/editing with Tiptap editor
- `/blog/details/[id]` — Blog post view with comments
- `/guestbook` — Visitor guestbook
- `/admin` — Admin dashboard

### API Routes (`src/app/api/`)

All under `/api/blog/` for blog CRUD, categories, comments, views, and file uploads. `/api/guestbook` for guestbook. `/api/auth/[...nextauth]` for NextAuth.

### Data Layer

- **Prisma** with PostgreSQL. Schema at `prisma/schema.prisma`. Single Prisma client instance from `src/lib/prisma.ts`.
- **Auth**: NextAuth v4 with GitHub + Google OAuth, PrismaAdapter. Config in `src/lib/authOptions.ts`. Admin determined by `ADMIN_EMAIL` env var match.
- **State**: Zustand stores in `src/store/` (video upload, form state, search, mobile menu).
- **Data fetching**: TanStack Query hooks in `src/hooks/` wrap Axios calls. Cursor-based infinite queries for lists.

### File Uploads

- **Images**: Client gets S3 presigned URL → uploads directly to S3 → served via CloudFront. Images compressed client-side with `browser-image-compression`. S3 paths: `blog/[dev|prod]/[folder]/[timestamp].ext`.
- **Videos**: Mux integration. Upload URL from API → client uploads to Mux → playback via `@mux/mux-player-react`.

### Rich Text Editor

Tiptap editor (`src/modules/common/Editor.tsx`) with custom extensions: ResizableImage (base64 + S3), MuxVideo, code blocks with syntax highlighting (lowlight), task lists, text alignment, font size, color. Content sanitized with DOMPurify.

### Module Structure (`src/modules/`)

Feature-based organization: `blog/`, `Category/`, `Comment/`, `common/`, `About/`, `Admin/`, `Guestbook/`. Each module contains page-level and sub-components for its feature.

### UI

shadcn/ui (New York style) components in `src/components/ui/`. Tailwind CSS v4 with oklch color variables for light/dark themes.

### Key Patterns

- Soft delete via `deletedAt` timestamp
- Only one blog can be pinned at a time
- Nested comments via `parentId`
- Secret content flags (`blogSecret`, `commentSecret`)
- Environment-aware S3 paths (dev/prod separation)
- GitHub Actions cron job (every 30min) for view count updates

## Path Aliases

`@/*` maps to `src/*` (configured in tsconfig.json and components.json).

## Deployment

Vercel. GitHub Actions workflow at `.github/workflows/blog-view.yml` for scheduled view updates.
