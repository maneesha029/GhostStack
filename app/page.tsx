"use client";

import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function HomePage() {
  return (
    <main className="flex-1">
      <div className="container py-8 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          GhostStack
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com"
            className="inline-flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <Github className="h-4 w-4" />
            View template repo
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="container pb-20">
        <div className="grid lg:grid-cols-[3fr,2fr] gap-10 items-center">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs text-zinc-300 backdrop-blur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-ghost-purple" />
              The Intelligent Sandbox That Hallucinates Your Backend.
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-zinc-50"
            >
              Reverse engineer any frontend.
              <span className="block text-ghost-purple">Watch GhostStack invent its backend.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-zinc-300 max-w-xl"
            >
              Paste a repo, upload a ZIP, or start with an idea. GhostStack scans your code, hallucinates
              a complete API surface, spins up a mock backend in-browser, and mentors you in real-time as
              you wire everything together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              <Button asChild size="lg" className="gap-2 text-sm sm:text-base">
                <Link href="/onboarding">
                  Scan My Repo
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-ghost-purple/40 text-ghost-purple">
                <Link href="/onboarding?mode=idea">
                  Start with an Idea
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-zinc-400"
            >
              <div>
                <div className="font-medium text-zinc-100">WebContainers</div>
                <div>StackBlitz-style sandbox, fully in-browser.</div>
              </div>
              <div>
                <div className="font-medium text-zinc-100">Mock APIs</div>
                <div>Auto-generated CRUD, latency & failures.</div>
              </div>
              <div>
                <div className="font-medium text-zinc-100">AI Mentor</div>
                <div>Understands logs, network, and schema.</div>
              </div>
              <div>
                <div className="font-medium text-zinc-100">Supabase</div>
                <div>Sessions, history, and ghost servers.</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel relative p-5 sm:p-6 lg:p-7 shadow-2xl border border-ghost-purple/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="flex -space-x-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </span>
                ghost-server/index.ts
              </div>
              <span className="rounded-full bg-ghost-purple/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-ghost-purple">
                Live mock backend
              </span>
            </div>
            <div className="rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-zinc-200 overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/5 px-3 py-2 text-[11px] text-zinc-400">
                <span>Terminal · ghost-container</span>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  running
                </span>
              </div>
              <div className="space-y-1 px-3 py-3">
                <div className="text-emerald-300">[ghost-server] Bootstrapping MirageJS mock layer…</div>
                <div className="text-emerald-300">[ghost-server] Detected 14 unique API surfaces.</div>
                <div className="text-emerald-300">[ghost-server] Synthesizing sample payloads + errors.</div>
                <div className="text-amber-300">
                  [mentor] Your /api/users/:id call is missing the `persona` field. Want me to patch it?
                </div>
                <div className="text-ghost-purple">
                  ➤ suggestion: fetch(&quot;/ghost/users/42&quot;, &#123; body: &#123; persona: &quot;student&quot; &#125;
                  &#125;)
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}


