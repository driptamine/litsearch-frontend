# LitLoop Frontend

LitLoop is a modern, responsive web application for searching and browsing music, movies, and more.

## Tech Stack

- **Framework:** React 18 with Vite
- **State Management:** Redux (Saga, Toolkit), Recoil, React Query
- **Routing:** React Router v5
- **Styling:** Styled Components, SASS
- **Icons:** React Icons (Font Awesome, Ionicons, etc.)

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/driptamine/litsearch-frontend.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:3001`.

## Deployment

The project is configured to be deployed on both **GitHub Pages** and **Netlify**.

### GitHub Pages

The application is hosted on GitHub Pages at a subpath (`/litsearch-frontend`). 

To deploy:
```bash
npm run deploy
```
This command builds the project for production and pushes the `dist` folder to the `gh-pages` branch.

### Netlify

The project includes a `netlify.toml` for easy deployment on Netlify. It automatically handles SPA routing and sets the correct publish directory.

**Configuration Details:**
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Dynamic Base Path:** The `vite.config.js` uses the `NETLIFY` environment variable to set the base path to `/` when building on Netlify, and `/litsearch-frontend/` otherwise.

### Multi-Platform Compatibility

The routing is handled dynamically using Vite's `import.meta.env.BASE_URL`. This allows the same codebase to run seamlessly whether it's at the root of a domain (Netlify/Local) or on a subpath (GitHub Pages).

## Features

- **Responsive Header:** Optimized for desktop and mobile with a toggleable mobile search bar.
- **Unified Search:** Search across multiple categories with autocomplete suggestions.
- **Theme Support:** Dark and light mode support via `styled-components`.
