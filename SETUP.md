# GhostStack Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- An OpenAI-compatible API endpoint (LM Studio, OpenRouter, or OpenAI)

## Step 1: Clone and Install

```bash
npm install
```

## Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the migration from `supabase/migrations/001_initial_schema.sql`
3. Get your project URL and anon key from Settings > API

## Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: For AI mentor functionality
OPENAI_API_URL=http://localhost:1234/v1  # LM Studio default
OPENAI_API_KEY=your_api_key
```

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 5: Set Up Authentication

1. In Supabase Dashboard, go to Authentication > Providers
2. Enable Email provider (or OAuth providers if desired)
3. Users can sign up directly from the onboarding page

## Features Overview

### Intelligent Repo Scanner
- Paste a GitHub URL or upload a ZIP file
- System automatically extracts:
  - `fetch()` and `axios()` calls
  - API endpoint patterns
  - TypeScript interfaces
  - Component props

### Browser-based IDE
- Monaco Editor for code editing
- Live preview iframe
- Terminal showing server logs
- File explorer sidebar

### Mock API Generator
- Automatically generates Express.js mock server
- Supports CRUD operations
- Configurable latency and error rates
- Hot reload on code changes

### AI Mentor Chatbot
- Real-time error detection
- Contextual suggestions
- "Apply Patch" functionality
- Persona-based guidance (Student/Professional)

### Test Scenario Simulator
- Adjustable latency (0-5000ms)
- Server outage simulation
- Random failure injection
- Pagination stress testing

## Project Structure

```
GhostStack/
├── app/                    # Next.js pages
│   ├── (app)/             # Protected routes
│   │   └── dashboard/     # Main IDE dashboard
│   ├── (auth)/            # Auth routes
│   │   └── onboarding/    # User onboarding
│   └── api/               # API routes
│       ├── analyze-repo/
│       ├── generate-api-schema/
│       ├── generate-mock-server/
│       └── mentor/
├── components/            # React components
│   ├── dashboard/         # Dashboard UI
│   ├── ide/               # Monaco editor + WebContainer
│   ├── mentor/            # AI chatbot
│   ├── onboarding/        # Onboarding flow
│   ├── test-scenarios/    # Test controls
│   └── ui/                # ShadCN components
├── lib/                   # Utilities
│   ├── mock-server/       # Mock generator
│   ├── repo-scanner/      # Code scanner
│   ├── stores/            # Zustand stores
│   └── supabase/          # Supabase clients
└── supabase/              # Database migrations
    └── migrations/
```

## Troubleshooting

### Monaco Editor not loading
- Ensure `@monaco-editor/react` is installed
- Check browser console for errors
- Try clearing browser cache

### WebContainer not starting
- WebContainers require a modern browser (Chrome/Edge recommended)
- Check that `@webcontainer/api` is properly installed
- Verify browser supports WebAssembly

### Supabase connection issues
- Verify environment variables are set correctly
- Check Supabase project is active
- Ensure RLS policies are configured

### AI Mentor not responding
- Verify OpenAI API endpoint is accessible
- Check API key is valid
- For LM Studio, ensure server is running on specified port

## Next Steps

1. Customize the mock server generator in `lib/mock-server/generator.ts`
2. Enhance repo scanner in `lib/repo-scanner/index.ts`
3. Integrate with your preferred LLM API in `app/api/mentor/route.ts`
4. Add more test scenarios in `components/test-scenarios/`

## License

MIT

