"use client";

import Hero from "@/components/Hero";
import CapabilityTicker from "@/components/CapabilityTicker";
import StatsTicker from "@/components/StatsTicker";
import ProblemSolution from "@/components/ProblemSolution";
import AuditForm from "@/components/AuditForm";
import ServiceDiscovery from "@/components/ServiceDiscovery";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function Home() {
  const scrollToForm = () => {
    document.getElementById("audit")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center font-bold text-sm text-zinc-950">
                A
              </div>
            </div>
            <span className="font-semibold text-white hidden sm:block">
              ATH Creative Studio
            </span>
          </div>

          <Button
            size="sm"
            onClick={scrollToForm}
            className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-medium"
          >
            Get Free Audit
          </Button>
        </div>
      </header>

      <main className="pt-16 min-h-screen font-sans">
        <Hero />
        <CapabilityTicker />
        <StatsTicker />
        <ProblemSolution />
        <AuditForm />
        <ServiceDiscovery />
        <Footer />
      </main>
    </>
  );
}
