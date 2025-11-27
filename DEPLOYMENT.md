# GhostStack Deployment Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Set up environment variables** (optional for basic functionality):
   Create `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

3. **Run development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

## Features Status

✅ **Fully Working:**
- Home page with animations
- Onboarding flow (persona selection + repo scanning)
- Dashboard with Magic Bento grid
- IDE with Monaco editor
- File explorer sidebar
- API route preview panel
- Terminal logs
- AI Mentor chatbot
- MockCraft AI interface
- Test scenario simulator
- Mock server generation
- Toast notifications

## Known Limitations

- WebContainer integration is simulated (not running real Node.js in browser)
- Supabase is optional (app works without it)
- Repo scanner uses mock data (real scanning would require GitHub API)

## Production Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Works with any Next.js hosting (Netlify, Railway, etc.)
- Ensure Node.js 18+ is available
- Set environment variables in platform settings

## Troubleshooting

- **Port already in use**: Server will try next available port
- **Monaco Editor not loading**: Check browser console, ensure @monaco-editor/react is installed
- **Supabase errors**: App works without Supabase, auth features will be disabled

