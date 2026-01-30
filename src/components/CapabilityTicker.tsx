"use client";

import { motion } from "framer-motion";

const capabilities = [
  "Event Coverage & Recaps",
  "AI Product Videos",
  "Product Videos",
  "Launch Campaign Content",
  "Monthly Media Partnership",
  "Personal Brand Videos",
  "Cinematic AI Clips",
  "AI Video Generation",
  "Talking Head Avatars",
  "Editing Your Footage",
  "Creating Clips from Long-Form",
  "On-Location Filming",
  "Stream Setup",
  "UGC Content Creation",
  "Podcast Production",
  "Full Recording Services",
  "Ambassador Content Programs",
  "Product Explainer Videos",
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
];

export default function CapabilityTicker() {
  const duplicatedCapabilities = [...capabilities, ...capabilities];

  return (
    <div className="relative py-8 overflow-hidden border-y border-white/5 bg-zinc-950/50">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-zinc-950 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />

      <motion.div
        className="flex gap-8 whitespace-nowrap w-max"
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 120,
          ease: "linear",
        }}
      >
        {duplicatedCapabilities.map((capability, index) => (
          <div key={index} className="flex items-center gap-8">
            <span className="text-zinc-400 font-medium text-sm">
              {capability}
            </span>
            <span className="text-emerald-500/40">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
