"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  "Event Coverage",
  "AI Product Videos",
  "Launch Campaigns",
  "Monthly Partnerships",
  "Personal Brand Videos",
  "Cinematic AI Clips",
  "Talking Head Avatars",
  "Professional Editing",
  "Long-Form to Clips",
  "On-Location Filming",
  "Stream Setup",
  "UGC Content Creation",
  "Podcast Production",
  "Full Recording Services",
  "Ambassador Programs",
  "Product Explainers",
  "Conference Activations",
  "Social Media Packages",
  "Podcast Repurposing",
  "Multi-Camera Production",
  "Content Strategy",
  "Platform Adaptation",
  "Documentary Storytelling",
  "Founder Interview Series",
  "Text-to-Video Content",
  "Hybrid AI + Live-Action",
  "Green Screen Filming",
  "Quarterly Strategy",
  "Brand Narrative Films",
  "Seasonal Campaigns",
  "Media Audits",
  "Narrative Development",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % capabilities.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const scrollToForm = () => {
    document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-24 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-zinc-950 to-zinc-950" />
        <div className="absolute inset-0 bg-grain opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 mb-8">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">
              Trusted by Solana Ecosystem
            </span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 397.7 311.7"
              fill="currentColor"
              aria-hidden
            >
              <defs>
                <linearGradient
                  id="solanaGradient"
                  x1="360.88"
                  y1="351.46"
                  x2="141.21"
                  y2="-69.29"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#00FFA3" />
                  <stop offset="1" stopColor="#DC1FFF" />
                </linearGradient>
              </defs>
              <path
                d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z"
                fill="url(#solanaGradient)"
              />
              <path
                d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z"
                fill="url(#solanaGradient)"
              />
              <path
                d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z"
                fill="url(#solanaGradient)"
              />
            </svg>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            We Help Web3 Projects{" "}
            <br className="hidden md:block" />
            Convert Attention Into Revenue Through{" "}
            <br className="hidden sm:block md:hidden" />
            {/* Fixed-height slot so longer rotating text doesn't shift layout */}
            <span className="inline-block min-h-[2.2em] align-top" style={{ lineHeight: 1.1 }}>
              <span className="block relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500"
                  >
                    {capabilities[currentIndex]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-4 leading-relaxed">
            From quick clips to full-time embedded media teams — we do it all.
          </p>
          <p className="text-sm text-zinc-600 mb-12">
            <span className="text-emerald-500 font-medium">32</span> services • Tailored approach • Permanently onchain
          </p>

          <div className="flex items-center justify-center">
            <Button
              size="lg"
              onClick={scrollToForm}
              className="group relative px-8 py-6 bg-emerald-500 text-zinc-950 font-semibold rounded-full text-lg overflow-hidden transition-all hover:bg-emerald-400 hover:shadow-[0_0_40px_-10px_rgba(16,185,129,0.6)] hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Free Media Audit
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
