# Versia 🌐

A full-stack social media web app with authentication, posts, likes, and profiles — built with React 19 and optimized for production-grade performance.

**Live:** [versia.vercel.app](https://versia.vercel.app)

## Features

- 🔐 User authentication and profiles
- 📝 Post creation, likes, and feed
- 🌙 Dark mode
- ⚡ Optimized state management with Redux + Zustand
- 🚀 CI/CD via GitHub Actions → Vercel on every push

## Tech Stack

- **Frontend:** React 19, Vite, Redux, Zustand
- **Backend / Data:** Appwrite, Node.js
- **Testing:** Playwright
- **Deployment:** Vercel
- **CI/CD:** GitHub Actions

## Performance Work

This project went through a full production optimization pass:

- **Fixed N+1 query bug** in the post-author fetch flow (`Card.jsx`), replacing per-post author lookups with a batched fetch
- **Consolidated caching** into a single TTL-based `TTLCache` with in-flight request de-duplication, replacing duplicate ad-hoc cache files
- **Route-level code splitting**, cutting the initial JS bundle from ~2.75MB down to a ~251KB entry chunk
- **Fixed rules-of-hooks violations** flagged by ESLint that could cause inconsistent renders
- **Removed dead/unused files** left over from earlier iterations
- **Fixed a viewport CSS bug** inherited from the Vite starter template
- **Verified responsiveness** across five device widths using Playwright screenshot testing

## Project Structure

```
Versia/
├── src/            # Application source
├── layout/          # Layout components
├── context/         # React context providers
├── store/           # Redux/Zustand state management
├── services/         # API and data-fetching services
├── Hooks/           # Custom React hooks
├── tests/           # Playwright test suite
├── test-results/     # Test output
└── public/           # Static assets
```

## Getting Started

```bash
git clone https://github.com/SHAHZIL14/Versia.git
cd Versia
npm install
npm run dev
```

Open `http://localhost:5173` (default Vite port) in your browser.

### Running tests

```bash
npx playwright test
```

## Deployment

Every push to `main` triggers a GitHub Actions workflow that builds and deploys automatically to Vercel.

## Roadmap

- [ ] Comments on posts
- [ ] Real-time notifications
- [ ] Direct messaging
- [ ] Infinite scroll for feed

## Author

**Mohd Shazil Raza**
[GitHub](https://github.com/SHAHZIL14) · [LinkedIn](https://linkedin.com/in/shazilr)
