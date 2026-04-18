# Furniture Odyssey Catalog Website - Developer Guide

This document provides essential context and instructions for AI agents and developers working on the Furniture Odyssey Catalog Website.

## Project Overview

Furniture Odyssey is a high-end furniture catalog website featuring a product showcase and an interactive table configurator.

- **Primary Stack:** React 19, Vite, TypeScript, Tailwind CSS v4.
- **State Management:** Zustand.
- **UI Components:** Radix UI, Lucide React, and custom components (following shadcn/ui patterns).
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage, RLS).

### Key Features

1.  **Product Catalog:** Browseable categories for Chairs, Tables, and Collections.
2.  **Table Configurator:** Interactive 3D-like configuration for customizable tables using transparent PNG layers (Top, Legs, Base).
3.  **Admin Dashboard:** Comprehensive management interface for products, categories, and table options.
4.  **Supabase Integration:** Real-time data fetching, image storage, and Row Level Security (RLS) for data protection.

## Project Structure

- `src/components/`: Reusable UI components.
- `src/pages/`: Main views (Home, Chairs, Tables, Collections, Admin).
- `src/stores/`: Zustand stores for catalog, configuration, admin state, and page content.
- `src/types/`: TypeScript interfaces and type definitions (e.g., `catalog.ts`).
- `src/lib/`: Client-side utilities and Supabase client setup (`client.ts`, `server.ts`).
- `src/data/`: Static fallback data and initial seed data.
- `scripts/`: Utility scripts for data processing or deployment.
- `supabase_schema.sql`: Database schema definition.
- `supabase_schema_explanation.md`: Detailed documentation of the database relational model.

## Building and Running

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
```

### Testing
```bash
npm run test        # Runs Vitest
npm run test:ui     # Runs Vitest with UI
```

### Linting
```bash
npm run lint
```

## Development Conventions

- **Path Aliases:** Use `@/` to refer to the `src/` directory (configured in `vite.config.ts` and `tsconfig.json`).
- **Styling:** Use Tailwind CSS v4 utility classes. Prefer CSS variables for theme-specific values.
- **State Management:** Use Zustand stores located in `src/stores/`. Avoid prop drilling for global state.
- **Database:** Adhere to the relational schema defined in `supabase_schema_explanation.md`. Use the `createClient` from `@/lib/client` for frontend data access.
- **React Patterns:** Leverage React 19 features where applicable. The React Compiler is enabled.
- **Security:** Always respect Row Level Security (RLS). Ensure admin operations are properly protected via Supabase Auth.
- **Environment Variables:** Required variables are listed in `.env.example`. Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are set.

## Database Schema (Summary)

- **`products`**: Main catalog table. `is_customizable` flag determines if a product uses the configurator.
- **`table_options`**: Stores layers (Top, Legs, Base) for customizable tables with price modifiers.
- **`option_incompatibilities`**: Join table to handle constraints between different table options (e.g., specific tops not working with specific bases).

Refer to `supabase_schema_explanation.md` for full relational details.
