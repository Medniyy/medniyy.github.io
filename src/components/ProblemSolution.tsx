"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Play, Layers } from "lucide-react";

export default function ProblemSolution() {
  return (
    <section className="py-24 md:py-32 bg-zinc-950 relative">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-6">
              The Problem
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Web3 projects live and die{" "}
              <span className="text-zinc-600">by momentum.</span>
            </h2>
            <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
              <p>
                You work hard to generate hype, but between shipping code and managing communities, the narrative often breaks.
              </p>
              <p>
                Silence doesn&apos;t just breed FUD; it drains liquidity. When communication drops, potential investors become passive observers. You are letting your most valuable asset (attention) leak away to louder, less capable competitors.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-emerald-500/10 blur-[120px] rounded-full" />
            <div className="relative bg-zinc-900/50 border border-white/10 rounded-2xl p-8 backdrop-blur-xl overflow-hidden">
              <div className="space-y-4">
                <div className="flex items-center gap-4 opacity-40">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                    <Play className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-zinc-800 rounded w-3/4" />
                    <div className="h-2 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-emerald-500/20 rounded w-4/5" />
                    <div className="h-2 bg-emerald-500/10 rounded w-2/3" />
                  </div>
                </div>

                <div className="flex items-center gap-4 opacity-40">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center border border-white/5">
                    <Layers className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="h-2 bg-zinc-800 rounded w-2/3" />
                    <div className="h-2 bg-zinc-800 rounded w-1/2" />
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-white/5">
                <p className="text-white font-semibold text-lg mb-2">
                  We become your external media arm.
                </p>
                <p className="text-sm text-zinc-500">
                  From one-off campaigns to long-term presence.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
