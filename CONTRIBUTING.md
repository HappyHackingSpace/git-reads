# Contributing to GitReads

Thank you for your interest in contributing to GitReads. This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Community](#community)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment. We expect all contributors to:

- Use welcoming and inclusive language
- Respect differing viewpoints and experiences
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

Before contributing, please:

1. Read through the [README.md](README.md) to understand the project
2. Check the [existing issues](https://github.com/HazarBakir/git-reads/issues) and [pull requests](https://github.com/HazarBakir/git-reads/pulls)
3. Review the [roadmap](#feature-roadmap) in the README to understand planned features

## Development Setup

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Git

### Initial Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/git-reads.git
   cd git-reads
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

5. Configure environment variables in `.env`:
   - `VITE_GITHUB_TOKEN`: Optional, increases API rate limits
   - `VITE_SUPABASE_URL`: Required for local session testing
   - `VITE_SUPABASE_ANON_KEY`: Required for local session testing

### Database Setup (Optional)

Database setup is only required if you need to test session management or highlight features locally:

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Navigate to SQL Editor in your dashboard
4. Execute the SQL files in `supabase/migrations/` in order:
   - `init_schema.sql`
   - `highlights.sql`
5. Get your credentials from Project Settings → API
6. Add them to your `.env` file

Note: All pull requests are automatically deployed to Vercel with full database access for complete feature testing.

### Running Locally

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## How to Contribute

### Types of Contributions

We welcome various types of contributions:

- **Bug fixes**: Fix issues identified in the issue tracker
- **New features**: Implement features from the roadmap or propose new ones
- **Documentation**: Improve README, comments, or create guides
- **UI/UX improvements**: Enhance design and user experience
- **Performance optimizations**: Improve application speed and efficiency
- **Testing**: Add or improve test coverage
- **Accessibility**: Improve ARIA labels, keyboard navigation, screen reader support

### Non-Code Contributions

You can contribute without writing code:

- Report bugs and issues
- Suggest new features
- Improve documentation
- Help answer questions in discussions
- Share the project with others

## Coding Standards

### TypeScript

- Follow existing TypeScript conventions
- Use proper type annotations
- Avoid using `any` types when possible
- Prefer interfaces over types for object shapes

### React

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component and variable names
- Extract reusable logic into custom hooks

### Styling

- Use Tailwind CSS utility classes
- Follow the existing component styling patterns
- Ensure responsive design (mobile, tablet, desktop)
- Maintain dark mode compatibility

### Accessibility

- Include proper ARIA labels
- Ensure keyboard navigation works
- Use semantic HTML elements
- Test with screen readers when possible

## Commit Guidelines

Write clear and meaningful commit messages using these prefixes:

- `Add:` for new features
- `Fix:` for bug fixes
- `Update:` for updates to existing features
- `Refactor:` for code refactoring
- `Docs:` for documentation changes
- `Style:` for formatting changes
- `Test:` for adding or updating tests
- `Chore:` for maintenance tasks

Example:
```
Add: highlight persistence across sessions
Fix: sidebar navigation on mobile devices
Update: improve search performance
```

## Pull Request Process

1. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following the coding standards

3. Test your changes:
   - Run `npm run dev` and test manually
   - Verify responsive design on different screen sizes
   - Test on multiple browsers (Chrome, Firefox, Safari)
   - Ensure no console errors or warnings

4. Commit your changes with descriptive messages

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a pull request:
   - Use a clear title describing the change
   - Fill out the pull request template
   - Reference any related issues
   - Include screenshots for UI changes
   - Describe testing performed

7. Respond to review feedback:
   - Be open to suggestions
   - Make requested changes promptly
   - Ask questions if something is unclear

### Pull Request Checklist

Before submitting, ensure:

- [ ] Code follows project style guidelines
- [ ] Changes are tested and working
- [ ] No console errors or warnings
- [ ] Responsive design is maintained
- [ ] Dark mode compatibility is preserved
- [ ] Documentation is updated if needed
- [ ] Commit messages follow guidelines
- [ ] Pull request description is clear

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

1. **Clear title**: Describe the issue concisely
2. **Steps to reproduce**: List exact steps to trigger the bug
3. **Expected behavior**: What should happen
4. **Actual behavior**: What actually happens
5. **Environment**:
   - Browser and version
   - Operating system
   - Node.js version (if relevant)
6. **Screenshots**: Include if applicable
7. **Console output**: Include any error messages

Use the [bug report template](https://github.com/HazarBakir/git-reads/issues/new?template=bug_report.yml).

### Security Issues

Do not open public issues for security vulnerabilities. Instead, contact the maintainers directly through GitHub.

## Feature Requests

We welcome feature suggestions! When proposing features:

1. Check if it's already in the [roadmap](README.md#feature-roadmap)
2. Search existing issues to avoid duplicates
3. Use the [feature request template](https://github.com/HazarBakir/git-reads/issues/new?template=feature_request.yml)
4. Clearly describe the problem and proposed solution
5. Explain why this feature would be useful
6. Consider implementation complexity

## Testing Your Changes

### Local Testing

Suitable for:
- UI/UX changes
- Component updates
- Styling modifications

Simply run `npm run dev` and test in your browser.

### Full Testing

Required for:
- Session management features
- Database operations
- Highlight functionality
- API integrations

Push your changes and the Vercel preview deployment will provide full database access.

## Project Structure

```
git-reads/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── document/     # Document page components
│   │   ├── highlights/   # Highlight system components
│   │   ├── landing/      # Landing page components
│   │   ├── layout/       # Layout components (sidebar, header)
│   │   └── ui/           # Base UI components (shadcn/ui)
│   ├── contexts/         # React context providers
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # External integrations (GitHub, Supabase)
│   │   ├── github/       # GitHub API functions
│   │   ├── highlights/   # Highlight management
│   │   ├── markdown/     # Markdown parsing and rendering
│   │   └── session/      # Session management
│   ├── pages/            # Route page components
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Helper functions and utilities
├── database/             # Database schema and migrations
├── public/               # Static assets (images, icons)
└── supabase/             # Supabase migrations
```

## Community

- **Issues**: [Report bugs or request features](https://github.com/HazarBakir/git-reads/issues)
- **Pull Requests**: [Contribute code](https://github.com/HazarBakir/git-reads/pulls)
- **Discussions**: [Ask questions and share ideas](https://github.com/HazarBakir/git-reads/discussions)

## Questions?

If you have questions that are not addressed in this guide:

1. Check the [README.md](README.md)
2. Search existing [discussions](https://github.com/HazarBakir/git-reads/discussions)
3. Open a new discussion with the `question` label
4. Join the conversation in existing issues and pull requests

## Recognition

All contributors will be recognized in the project. Your contributions, whether code, documentation, or community support, are valued and appreciated.

Thank you for contributing to GitReads!