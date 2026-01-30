"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Video,
  Scissors,
  FileText,
  Mic,
  Target,
  Handshake,
  Play,
  Megaphone,
  Users,
  Sparkles,
  Film,
  TrendingUp,
  MessageSquare,
  Calendar,
  Rocket,
  BarChart3,
  BookOpen,
  Camera,
  Edit3,
  Globe,
  Zap,
  Award,
  Layers,
  PenTool,
} from "lucide-react";

const serviceCategories = [
  {
    category: "Video Production",
    icon: Video,
    services: [
      { title: "Event coverage & recap videos", icon: Camera },
      { title: "AI product videos", icon: Sparkles },
      { title: "Product videos", icon: Play },
      { title: "Personal brand videos for founders", icon: Mic },
      { title: "Cinematic AI clips & AI video generation", icon: Film },
      { title: "Talking head avatars", icon: Users },
      { title: "On-location filming (we travel to you)", icon: Globe },
      { title: "Multi-camera production", icon: Layers },
      { title: "Documentary-style storytelling", icon: BookOpen },
      { title: "Green screen setup and filming", icon: Video },
      { title: "Brand narrative films", icon: Award },
    ],
  },
  {
    category: "Content & Strategy",
    icon: Target,
    services: [
      { title: "Launch campaign content", icon: Rocket },
      { title: "Content strategy and narrative development", icon: FileText },
      { title: "Platform-specific content adaptation", icon: Megaphone },
      { title: "Quarterly content strategy", icon: Calendar },
      { title: "Seasonal campaign series", icon: TrendingUp },
      { title: "Media audit and positioning", icon: BarChart3 },
      { title: "Social media content packages", icon: MessageSquare },
    ],
  },
  {
    category: "Editing & Post",
    icon: Edit3,
    services: [
      { title: "Editing your existing footage", icon: Scissors },
      { title: "Creating clips from long-form content", icon: Scissors },
      { title: "Repurposing podcast episodes", icon: Zap },
      { title: "Text-to-video content", icon: PenTool },
      { title: "Hybrid AI + live-action content", icon: Sparkles },
    ],
  },
  {
    category: "Ongoing Partnership",
    icon: Handshake,
    services: [
      { title: "Monthly media partnership", icon: Calendar },
      { title: "Help you start a podcast", icon: Mic },
      { title: "Record you talking (we handle everything)", icon: Video },
      { title: "Ambassador content programs", icon: Users },
      { title: "Setting up your stream", icon: Play },
      { title: "UGC content creation", icon: Camera },
      { title: "Conference activations", icon: Megaphone },
      { title: "Founder interview series", icon: Mic },
    ],
  },
];

export default function ServiceDiscovery() {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="max-w-6xl mx-auto py-24 px-6">
      <div className="text-center mb-16">
        <p className="text-xs font-semibold text-emerald-500 uppercase tracking-widest mb-4">
          Our Approach
        </p>
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          32 Ways We Can Help
        </h2>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
          From one-off campaigns to becoming your full external media team
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {serviceCategories.map((cat, index) => (
          <button
            key={cat.category}
            onClick={() => setActiveCategory(index)}
            type="button"
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
              activeCategory === index
                ? "bg-emerald-500 text-zinc-950 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]"
                : "bg-zinc-900/50 text-zinc-400 border border-white/10 hover:border-emerald-500/30 hover:text-white"
            }`}
          >
            <cat.icon className="w-4 h-4" />
            <span className="text-sm">{cat.category}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {serviceCategories[activeCategory].services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className="group bg-zinc-900/30 border border-white/10 rounded-xl p-6 hover:border-emerald-500/30 hover:bg-zinc-900/50 transition-all cursor-pointer backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
                  <service.icon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-sm font-medium text-white flex-1">
                  {service.title}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-16 text-center"
      >
        <p className="text-zinc-500 mb-6">
          Don&apos;t see what you need? We&apos;re flexible.
        </p>
        <button
          type="button"
          onClick={() =>
            document
              .getElementById("audit")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="px-8 py-4 bg-white/5 border border-white/10 rounded-full text-white font-medium hover:bg-white/10 hover:border-emerald-500/30 transition-all"
        >
          Tell us what you&apos;re looking for →
        </button>
      </motion.div>
    </div>
  );
}
