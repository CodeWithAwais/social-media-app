# Pulse — Mini Social Media App
 
A modern social media feed app built with React, TypeScript, and Vite. Built as a capstone project after completing a full TypeScript + React curriculum.
 
![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat&logo=tailwindcss)
 
---
 
## Features
 
- **Authentication** — login with any username, protected routes redirect unauthenticated users
- **Feed** — view all posts, filter by category in real time
- **Create Post** — add caption, image URL, and category
- **Like / Unlike** — toggle likes with animated heart button
- **Profile Page** — view your posts, follower count, follow/unfollow yourself
- **Category Filtering** — filter feed by Tech, Lifestyle, Travel, Food — stored in URL via `useSearchParams`
- **Protected Routes** — unauthenticated users are redirected to login
- **Animations** — smooth page transitions and micro-interactions via Framer Motion
---
 
## Tech Stack
 
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety throughout |
| Vite | Build tool and dev server |
| React Router v6 | Client-side routing, protected routes |
| Tailwind CSS v4 | Styling and dark theme |
| Framer Motion | Animations and transitions |
| Lucide React | Icons |
| Context API | Global state — auth + feed |
 
---
 
## Project Structure
 
```
src/
├── types/
│   └── index.ts              # All interfaces and context objects
├── context/
│   ├── AuthContext.tsx        # Auth provider — login, logout, follow
│   └── FeedContext.tsx        # Feed provider — posts, likes, filtering
├── hooks/
│   ├── useAuth.ts             # Auth context hook
│   ├── useFeed.ts             # Feed context hook
│   ├── useFilter.ts           # Derived filtered posts
│   └── useLike.ts             # Like helpers
├── components/
│   ├── Navbar.tsx             # Sticky nav with active links
│   ├── PostCard.tsx           # Single post card with like button
│   ├── PostComposer.tsx       # Create post form
│   └── ProtectedRoute.tsx     # Auth guard using Outlet
├── Pages/
│   ├── Feed.tsx               # Main feed with category filter
│   ├── Profile.tsx            # User profile with posts
│   ├── Login.tsx              # Login page
│   └── PageNotFound.tsx       # 404 page
├── App.tsx                    # Routes and layout
└── main.tsx                   # Entry point
```
 
---
 
## TypeScript Concepts Used
 
This project was built as a learning capstone — every major TypeScript and React concept is applied:
 
- **Interfaces & Type Aliases** — `User`, `Post`, `Category`, `NewPostForm`
- **Generics** — `useState<User | null>`, `createContext<AuthContextType | null>`
- **Utility Types** — `Partial<Record<keyof T, string>>` for form errors
- **Union Types** — `Category`, `User | null`, `string | undefined`
- **Type Narrowing** — null checks before accessing user properties
- **Typed Event Handlers** — `React.ChangeEvent`, `React.FormEvent`, `React.KeyboardEvent`
- **Typed Props** — every component has an explicit props interface
- **Custom Hooks with Return Types** — `useFilter`, `useLike`, `useAuth`, `useFeed`
- **Context API with TypeScript** — fully typed context + custom hook with null guard
- **React Router Types** — `useParams<{ username: string }>`, `useSearchParams`, `useLocation`
---
 
## Getting Started
 
```bash
# Clone the repo
git clone https://github.com/yourusername/pulse-social.git
cd pulse-social
 
# Install dependencies
npm install
 
# Start dev server
npm run dev
```
 
Open `http://localhost:5173` in your browser.
 
---
 
## Usage
 
1. Enter any username on the login page and press **Sign in**
2. You land on the **Feed** — three starter posts are preloaded
3. Use the **category pills** to filter posts
4. Click **New Post** to create your own post with a caption, image URL, and category
5. Click the **heart** to like or unlike any post
6. Visit your **Profile** from the navbar to see your posts and follower count
> **Note:** Data is held in memory — refreshing the page resets all state. Firebase integration is planned as the next step.
 
---
 
## Planned Improvements
 
- [ ] Persist data with `localStorage`
- [ ] Replace fake auth with Firebase Authentication
- [ ] Store posts in Firestore with real-time listeners
- [ ] Image upload via Firebase Storage
- [ ] Comments on posts
- [ ] Follow other users (requires multi-user support)
---
 
## Author
 
**Awais** — BS Software Engineering, Virtual University of Pakistan  
Built as part of a self-taught TypeScript + React curriculum.
 
---
 
## License
 
MIT
