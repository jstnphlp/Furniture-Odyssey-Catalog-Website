# Furniture Odyssey Catalog Website

Furniture Odyssey is a high-end furniture catalog website featuring a product showcase and an interactive 3D-like table configurator.

## 🌟 Main Features

### 1. Product Catalog
A comprehensive, browseable catalog for exploring different types of furniture:
- **Chairs**
- **Tables**
- **Collections**

### 2. Interactive Table Configurator
An advanced 3D-like configuration tool specifically designed for customizable tables. It allows users to mix and match different table components:
- **Tops**
- **Legs**
- **Bases**

This feature renders using layered transparent PNGs to visually construct the final customized product in real-time.

### 3. Admin Dashboard
A robust, secure management interface used to oversee the entire platform:
- Product and category management
- Customizable table options management (prices, compatibilities)
- Image uploads and synchronization

### 4. Real-time Backend (Supabase)
Powered by Supabase for a seamless backend experience:
- **PostgreSQL Database** for structured relational data.
- **Supabase Storage** for high-quality product image hosting.
- **Supabase Auth** and **Row Level Security (RLS)** ensuring safe admin operations.

## 🛠️ Technology Stack

- **Frontend Framework:** React 19 with Vite (React Compiler enabled)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, `tw-animate-css`
- **State Management:** Zustand
- **UI Components:** Radix UI, Lucide React, Shadcn/ui patterns
- **Backend/Database:** Supabase (PostgreSQL, Auth, Storage, RLS)
- **Testing:** Vitest and React Testing Library

## 📂 Project Structure

- `src/components/` - Reusable UI components (buttons, layout, configurators).
- `src/pages/` - Main view components (`HomePage`, `ChairsPage`, `TablesPage`, `CollectionsPage`, `AdminPage`).
- `src/stores/` - Zustand stores managing global state for the catalog, configurations, admin tasks, and page content.
- `src/types/` - TypeScript interface definitions across the project.
- `src/lib/` - Supabase client setup (`client.ts`, `server.ts`) and client-side utilities.
- `src/data/` - Static fallback data and initial seeding data.
- `supabase_schema.sql` - Database schema definition.
- `supabase_schema_explanation.md` - Documentation of the relational database model.

## 🚀 Getting Started

### Prerequisites
- Node.js
- Supabase project (for backend services)

### Setup & Installation
1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
2. Set up your environment variables. Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

### Running the Application

- **Development Server:**
  ```bash
  npm run dev
  ```
- **Production Build:**
  ```bash
  npm run build
  ```
- **Preview Production Build:**
  ```bash
  npm run preview
  ```

### Testing & Linting

- **Run Unit Tests:**
  ```bash
  npm run test
  ```
- **Run Tests with UI:**
  ```bash
  npm run test:ui
  ```
- **Lint Codebase:**
  ```bash
  npm run lint
  ```
