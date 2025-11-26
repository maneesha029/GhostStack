# GhostStack

A browser-based Reverse Engineering IDE that automatically generates mock APIs, runs them inside a browser sandbox, and provides real-time intelligent mentorship.

## Features

- **Intelligent Repo Scanner**: Automatically scans GitHub repos or ZIP files to extract API endpoints, TypeScript interfaces, and fetch/axios calls
- **Browser-based Codespace**: Full IDE experience with Monaco Editor and WebContainers runtime
- **Auto-Generated Mock APIs**: Dynamic mock backend with hot reload, CRUD operations, and error simulation
- **Adaptive AI Mentor**: Context-aware chatbot that monitors API calls and provides real-time guidance
- **Test Scenario Simulator**: Simulate latency, server outages, and random failures
- **Supabase Integration**: User authentication and session persistence

## Tech Stack

- Next.js 15 with App Router (TypeScript)
- React 19
- TailwindCSS + ShadCN UI
- Supabase (Auth + DB)
- WebContainers (in-browser Node.js runtime)
- Monaco Editor
- TanStack Query + Zustand
- OpenAI-compatible LLM API

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Supabase credentials and OpenAI-compatible API endpoint.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── (app)/             # Protected app routes
│   ├── (auth)/            # Auth routes
│   └── api/               # API routes
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── ide/               # IDE components
│   ├── mentor/            # AI mentor chatbot
│   ├── onboarding/        # Onboarding flow
│   ├── test-scenarios/    # Test scenario controls
│   └── ui/                # ShadCN UI components
├── lib/                   # Utilities and helpers
│   ├── mock-server/       # Mock server generator
│   ├── repo-scanner/      # Repository scanner
│   ├── stores/            # Zustand stores
│   └── supabase/          # Supabase client/server
└── public/                # Static assets
```

## Database Schema

The application uses Supabase with the following tables:

- `users` - User accounts with persona preferences
- `projects` - User projects and configurations
- `mock_definitions` - Generated API schemas and routes
- `chat_history` - AI mentor conversation history

## License

MIT

