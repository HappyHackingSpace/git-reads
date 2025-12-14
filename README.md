# GitReads

<div align="center">
  <img src="public/papyr-logo-light.png" alt="GitReads Logo" width="120" />
  
  <h3>Discover README Files, Reimagined</h3>
  
  <p>Transform GitHub documentation into a beautifully organized reading experience with intelligent highlighting and navigation</p>
  
  ![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white) ![License](https://img.shields.io/badge/License-MIT-green.svg)
</div>

---

## Overview

GitReads transforms GitHub README files into beautifully formatted, easy-to-navigate documentation with persistent highlighting capabilities. Whether you are exploring open-source projects or documenting your own work, GitReads provides an elegant reading experience with intelligent navigation, powerful search capabilities, and the ability to highlight and annotate important sections that persist across sessions.

**New in this version**: Color-coded highlighting with three priority levels, automatic pagination for large documents, and 24-hour persistent sessions.

## Features

| Feature | Description |
|---------|-------------|
| **Smart Navigation** | Auto-generated table of contents with collapsible sections for effortless browsing |
| **Advanced Search** | Real-time search through documentation with instant results |
| **Persistent Highlighting** | Highlight text with color-coded priorities that persist across sessions |
| **Branch Switching** | Seamlessly view README files from any branch |
| **Session Management** | Secure 24-hour sessions with automatic activity tracking |
| **Pagination Support** | Large README files are split into manageable pages |
| **Full Markdown Support** | Rich rendering with code highlighting, tables, images, and links |
| **Responsive Design** | Optimized experience across desktop, tablet, and mobile devices |

## Quick Start

### Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **GitHub Personal Access Token** (optional, for higher API rate limits)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/HappyHackingSpace/git-reads.git
cd git-reads
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Edit your `.env` file:

```env
# Optional: Increases GitHub API rate limits (60 → 5000 requests/hour)
VITE_GITHUB_TOKEN=your_github_token_here

# Required for session management and highlighting features
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Start the development server**

```bash
npm run dev
```

5. **Open your browser**

Navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Usage

1. **Enter a repository URL**  
   Example: `https://github.com/happyhackingspace/awesome-hackathon`

2. **Navigate with ease**  
   Use the sidebar table of contents to jump between sections

3. **Search intelligently**  
   Find specific content instantly with the search bar

4. **Highlight important sections**  
   Select text and choose from three priority levels:
   - **Low** (Green): General information
   - **Medium** (Orange): Important details
   - **High** (Red): Critical content
   
   Your highlights are automatically saved and persist across sessions

5. **Switch branches**  
   View documentation from different branches using the dropdown

6. **Navigate pages**  
   For large README files, use the pagination controls at the top and bottom of the content

## Tech Stack

<table>
  <tr>
    <td><strong>Frontend</strong></td>
    <td>React 19, TypeScript, Vite</td>
  </tr>
  <tr>
    <td><strong>Styling</strong></td>
    <td>Tailwind CSS 4, shadcn/ui, Radix UI</td>
  </tr>
  <tr>
    <td><strong>Routing</strong></td>
    <td>React Router DOM</td>
  </tr>
  <tr>
    <td><strong>Markdown</strong></td>
    <td>react-markdown with GitHub Flavored Markdown (GFM)</td>
  </tr>
  <tr>
    <td><strong>Database</strong></td>
    <td>Supabase (PostgreSQL)</td>
  </tr>
  <tr>
    <td><strong>Animation</strong></td>
    <td>Framer Motion</td>
  </tr>
</table>

## Database Setup

Database setup is required for session management and highlighting features.

### Local Development Setup

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to **SQL Editor** in your dashboard
4. Execute the SQL files in order:
   - First: `supabase/migrations/init_schema.sql`
   - Second: `supabase/migrations/highlights.sql`
5. Get your credentials from **Project Settings → API**
6. Add them to your `.env` file

**Note**: All pull requests are automatically deployed to Vercel with full database access for complete feature testing.

## Project Architecture

### Session Management

GitReads uses a session-based approach to manage user state:

- Sessions last 24 hours from creation
- Each session is tied to a specific repository, branch, and user
- Highlights are associated with sessions
- Sessions automatically expire after 24 hours

### Highlighting System

The highlighting system allows users to:

- Select text and assign color-coded priority levels
- Store highlights with precise character offsets
- Maintain highlights across page navigation
- View all highlights in a floating action button (FAB)
- Jump to specific highlights across paginated content

### Pagination

Large README files are automatically split into manageable chunks:

- Each chunk is approximately 20,000 characters
- Navigation controls appear at the top and bottom
- Highlights are page-aware and persist correctly
- Table of contents links navigate between pages

## Contributing

We welcome contributions! Whether it's a bug fix, new feature, or documentation improvement, your help is appreciated.

### Getting Started

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make** your changes
4. **Commit** with clear messages
   ```bash
   git commit -m "Add: amazing new feature"
   ```
5. **Push** to your fork
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open** a Pull Request

### Contribution Guidelines

- Follow existing code style and TypeScript conventions
- Ensure components are accessible (ARIA labels, keyboard navigation)
- Test on multiple browsers (Chrome, Firefox, Safari)
- Verify responsive design on various screen sizes
- Write descriptive commit messages using prefixes:
  - `Add:` for new features
  - `Fix:` for bug fixes
  - `Update:` for updates to existing features
  - `Refactor:` for code refactoring
  - `Docs:` for documentation changes

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

### Testing Your Changes

| Testing Type | Method | When to Use |
|--------------|--------|-------------|
| **Local Testing** | Run `npm run dev` | UI/UX changes, styling, components |
| **Full Testing** | Push PR for Vercel preview | Session management, database features, integrations |

### Project Structure

```
git-reads/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── document/     # Document-specific components
│   │   ├── highlights/   # Highlighting system components
│   │   ├── landing/      # Landing page components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Base UI components (shadcn/ui)
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # External service integrations
│   │   ├── github/       # GitHub API integration
│   │   ├── highlights/   # Highlight management
│   │   ├── markdown/     # Markdown parsing and rendering
│   │   └── session/      # Session management
│   ├── pages/            # Route page components
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions and utilities
├── database/             # Database schema documentation
├── supabase/             # Supabase migration files
├── public/               # Static assets (images, icons)
└── ...config files
```

## Troubleshooting

<details>
<summary><strong>API rate limit exceeded</strong></summary>

- Add a GitHub Personal Access Token to your `.env` file
- Create one at [github.com/settings/tokens](https://github.com/settings/tokens)
- Requires only public repository read access
</details>

<details>
<summary><strong>Port 5173 already in use</strong></summary>

- Kill the process: `lsof -ti:5173 | xargs kill -9` (macOS/Linux)
- Or change the port in `vite.config.ts`
</details>

<details>
<summary><strong>Module not found errors</strong></summary>

- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`
</details>

<details>
<summary><strong>Session expired message</strong></summary>

- Sessions last 24 hours
- Simply enter a new repository URL to create a new session
- Your previous highlights are preserved with the old session
</details>

<details>
<summary><strong>Highlights not appearing</strong></summary>

- Ensure database environment variables are set correctly
- Check browser console for any errors
- Verify you're on the same page where the highlight was created
- Refresh the page and wait for highlights to load
</details>

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Links

- **Documentation**: [CONTRIBUTING.md](CONTRIBUTING.md)
- **Issues**: [Report a bug](https://github.com/HappyHackingSpace/git-reads/issues)
- **Pull Requests**: [Contribute code](https://github.com/HappyHackingSpace/git-reads/pulls)
- **Discussions**: [Join the conversation](https://github.com/HappyHackingSpace/git-reads/discussions)

## Acknowledgments

Built with dedication for the open-source community. Special thanks to all contributors who help make GitReads better.

---

<div align="center">
  <p>Made with ❤️ by HappyHackingSpace </p>
</div>