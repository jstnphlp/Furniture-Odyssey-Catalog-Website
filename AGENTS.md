# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React + TypeScript catalog site. Application code lives in `src/`: pages in `src/pages`, reusable UI in `src/components`, state stores in `src/stores`, shared helpers in `src/lib`, data/types in `src/data` and `src/types`, and global styles in `src/index.css`. Tests are colocated with the code as `*.test.ts` or `*.test.tsx`.

Static assets are in `public/`, including product images, logos, icons, layered configurator assets, and media. Build output goes to `dist/` and should not be edited. Supabase SQL files and migrations live at the repo root and under `supabase/migrations/`. Utility scripts are in `scripts/`.

## Build, Test, and Development Commands

- `npm run dev`: start the Vite development server.
- `npm run build`: run TypeScript project builds, then create the production Vite build in `dist/`.
- `npm run preview`: serve the production build locally for validation.
- `npm run lint`: run ESLint across the repository.
- `npm test`: run the Vitest test suite.

Use `npm install` to restore dependencies from `package-lock.json`.

## Coding Style & Naming Conventions

Write React components in TypeScript with `.tsx` files and use PascalCase for component names, such as `ProductCard.tsx`. Use camelCase for functions, hooks, stores, and variables; hooks should start with `use`, such as `useCartStore`. Keep tests named after the unit under test, for example `LiveCatalog.test.tsx`.

ESLint is configured in `eslint.config.js` with recommended JavaScript, TypeScript, React Hooks, and React Refresh rules. Match the existing style: single quotes, no semicolons, concise functional components, and two-space indentation.

## Testing Guidelines

Vitest, React Testing Library, `jsdom`, and `@testing-library/jest-dom` are available. Add or update colocated tests when changing component behavior, stores, utilities, or data transforms. Prefer user-facing assertions for React components and direct state assertions for Zustand stores. Run `npm test` before opening a pull request, and run `npm run build` for changes that affect routing, types, or production assets.

## Commit & Pull Request Guidelines

Recent history uses short, imperative commit subjects, sometimes prefixed by scope or type, such as `feature: added splash screen`, `Schema migrated from supabase`, and `Create FullSizeRender.mp4`. Keep commits focused and describe the visible change.

Pull requests should include a short summary, testing performed, linked issues when relevant, and screenshots or screen recordings for UI changes. Call out Supabase schema or migration changes explicitly, including any required environment variables from `.env.example`.

## Security & Configuration Tips

Do not commit real secrets from `.env`; keep `.env.example` as the public template. Review row-level security and storage policy SQL carefully before applying Supabase changes, and document any manual database step in the pull request.
