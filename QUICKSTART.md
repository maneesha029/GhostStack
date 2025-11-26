# GhostStack Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 15, React 19, TypeScript
- Supabase client libraries
- Three.js (for MockCraft AI animations)
- Monaco Editor, WebContainers
- All UI components and utilities

### Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI-compatible API (Optional - for AI mentor)
OPENAI_API_URL=http://localhost:1234/v1
OPENAI_API_KEY=your_api_key
```

**To get Supabase credentials:**
1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Settings > API
4. Copy your Project URL and anon/public key
5. Run the migration SQL from `supabase/migrations/001_initial_schema.sql` in the SQL Editor

### Step 3: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 What You Can Do Now

### 1. **Home Page** (`/`)
- Beautiful landing page with hero section
- "Scan My Repo" and "Start with an Idea" buttons
- Animated terminal preview

### 2. **Onboarding** (`/onboarding`)
- Choose persona (Student/Professional)
- Upload GitHub repo or ZIP file
- System will scan and generate mock APIs

### 3. **Dashboard** (`/dashboard`)
- Magic Bento grid overview with 8 action cards:
  - **Scan My Repo** - Upload and analyze code
  - **Open Last Workspace** - Continue previous work
  - **View Tutorials** - Learn GhostStack
  - **Access AI Mentor** - Get real-time help
  - **API Schema Viewer** - Explore endpoints
  - **Test Scenarios** - Simulate conditions
  - **MockCraft AI** - Interactive mock server generator
  - **Quick Start** - Template projects

### 4. **MockCraft AI** (`/mockcraft`)
- Interactive chat interface
- Upload API schemas (OpenAPI, Swagger, Postman)
- Generate mock servers
- Test endpoints
- Beautiful Three.js animated background

### 5. **IDE Workspace** (after scanning a repo)
- Monaco Editor for code editing
- Live preview iframe
- Terminal with server logs
- File explorer sidebar
- AI Mentor chatbot (bottom-right)
- Test scenario controls

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## 📁 Project Structure

```
GhostStack/
├── app/                    # Next.js pages & API routes
│   ├── (app)/             # Protected routes
│   │   ├── dashboard/     # Main dashboard
│   │   └── mockcraft/     # MockCraft AI
│   ├── (auth)/            # Auth routes
│   │   └── onboarding/   # User onboarding
│   └── api/               # API endpoints
├── components/            # React components
│   ├── dashboard/         # Dashboard UI
│   ├── ide/               # Monaco editor + WebContainer
│   ├── mentor/           # AI chatbot
│   ├── mockcraft/         # MockCraft AI interface
│   └── ui/                # ShadCN components
├── lib/                   # Utilities & stores
│   ├── mock-server/       # Mock generator
│   ├── repo-scanner/      # Code scanner
│   └── stores/            # Zustand state
└── supabase/              # Database migrations
```

## 🔧 Troubleshooting

### "Module not found" errors
- Run `npm install` again
- Delete `node_modules` and `.next` folders, then reinstall

### Supabase connection issues
- Verify `.env.local` has correct credentials
- Check Supabase project is active
- Ensure migration SQL has been run

### Three.js background not showing
- Check browser console for errors
- Ensure `three` package is installed
- Try hard refresh (Ctrl+Shift+R)

### Monaco Editor not loading
- Clear browser cache
- Check network tab for failed requests
- Verify `@monaco-editor/react` is installed

## 🎨 Customization

### Change Theme Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  ghost: {
    purple: "#a855f7",      // Main accent
    "purple-soft": "#3b0764" // Gradient
  }
}
```

### Add More API Routes
Create files in `app/api/` following the existing pattern.

### Customize Mock Server Generator
Edit `lib/mock-server/generator.ts` to change how mock APIs are generated.

## 📚 Next Steps

1. **Set up Supabase** - Required for authentication and data persistence
2. **Test the onboarding flow** - Upload a sample repo
3. **Explore MockCraft AI** - Try uploading an API schema
4. **Customize for your needs** - Modify components and logic
5. **Deploy** - Use Vercel, Netlify, or your preferred platform

## 🆘 Need Help?

- Check `SETUP.md` for detailed setup instructions
- Review `README.md` for project overview
- Check component files for inline comments

Happy coding! 🚀

