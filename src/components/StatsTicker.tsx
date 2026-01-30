"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Videos Produced", value: "500+" },
  { label: "Years in Crypto", value: "5" },
  { label: "Ecosystem Trusted", value: "Solana" },
];

export default function StatsTicker() {
  return (
    <div className="border-y border-white/5 bg-zinc-950/50 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center md:items-start relative md:first:pl-0 md:border-l border-white/5 md:first:border-l-0 md:pl-8"
            >
              <span className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-2">
                {stat.value}
              </span>
              <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
