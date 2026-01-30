"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Phone, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  project: z.string().min(3, "Project name or link is required"),
  goal: z.enum(["audit", "specific"]),
  needs: z.string().optional(),
  timeline: z.string().optional(),
  revenue: z.string().min(1, "Please select your revenue range"),
  contact: z.string().optional(),
  email: z.string().email("Valid email required"),
});

type FormData = z.infer<typeof formSchema>;

function SegmentedControl({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/10">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${
            value === option
              ? "bg-zinc-800 text-white shadow-sm"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function ToggleCard({
  icon: Icon,
  title,
  selected,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl border transition-all duration-200 ${
        selected
          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
          : "bg-zinc-900/30 border-white/10 text-zinc-400 hover:bg-zinc-900/50 hover:border-white/20"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="text-sm font-medium">{title}</span>
    </button>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function AuditForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: "audit",
      timeline: "ASAP",
      contact: "twitter",
    },
  });

  const goalValue = watch("goal");
  const timelineValue = watch("timeline");
  const contactValue = watch("contact");
  const revenueValue = watch("revenue");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Form submitted:", data);
    setIsSubmitting(false);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3000);
  };

  return (
    <section className="py-24 md:py-32 bg-zinc-950" id="audit">
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Get Your Free Media Audit
          </h2>
          <p className="text-lg text-zinc-400">
            We&apos;ll review your current presence and show you what&apos;s working (and
            what&apos;s not).
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-zinc-900/30 border border-white/10 rounded-2xl p-6 md:p-10 backdrop-blur-xl shadow-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="project"
                className="text-xs font-medium text-zinc-400 uppercase tracking-wide"
              >
                Project Name + Link *
              </Label>
              <Input
                id="project"
                placeholder="e.g., YourProject.xyz or @YourTwitter"
                className="bg-zinc-900/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-12 text-base"
                {...register("project")}
              />
              {errors.project && (
                <p className="text-red-400 text-sm">{errors.project.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                What are you looking for?
              </Label>
              <RadioGroup
                value={goalValue}
                onValueChange={(value) =>
                  setValue("goal", value as "audit" | "specific")
                }
              >
                <div className="space-y-4">
                  <label className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-zinc-900/50 cursor-pointer hover:border-white/20 hover:bg-zinc-900/70 transition-all group">
                    <RadioGroupItem value="audit" id="audit-option" className="mt-1" />
                    <div className="flex-1">
                      <span className="block text-base font-medium text-white group-hover:text-emerald-400 transition-colors">
                        Free audit of current media presence
                      </span>
                      <span className="block text-sm text-zinc-500 mt-1">
                        We&apos;ll review what you have and suggest improvements.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-zinc-900/50 cursor-pointer hover:border-white/20 hover:bg-zinc-900/70 transition-all group">
                    <RadioGroupItem value="specific" id="specific-option" className="mt-1" />
                    <div className="flex-1">
                      <span className="block text-base font-medium text-white group-hover:text-emerald-400 transition-colors">
                        I have something specific in mind
                      </span>
                    </div>
                  </label>
                </div>
              </RadioGroup>

              <AnimatePresence>
                {goalValue === "specific" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <Textarea
                      placeholder="Tell us what you need..."
                      className="mt-4 bg-zinc-900/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 min-h-[120px]"
                      {...register("needs")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Timeline
              </Label>
              <SegmentedControl
                value={timelineValue || "ASAP"}
                onChange={(value) => setValue("timeline", value)}
                options={["ASAP", "2-4 weeks", "Flexible"]}
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="revenue"
                className="text-xs font-medium text-zinc-400 uppercase tracking-wide"
              >
                Monthly Revenue *
              </Label>
              <Select
                value={revenueValue}
                onValueChange={(value) => setValue("revenue", value)}
              >
                <SelectTrigger className="bg-zinc-900/50 border-white/10 h-12 text-base">
                  <SelectValue placeholder="Select your revenue range..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pre-revenue">Pre-revenue</SelectItem>
                  <SelectItem value="1k-10k">$1k - $10k</SelectItem>
                  <SelectItem value="10k-50k">$10k - $50k</SelectItem>
                  <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                  <SelectItem value="100k+">$100k+</SelectItem>
                </SelectContent>
              </Select>
              {errors.revenue && (
                <p className="text-red-400 text-sm">{errors.revenue.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-zinc-400 uppercase tracking-wide"
              >
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="bg-zinc-900/50 border-white/10 focus:border-emerald-500/50 focus:ring-emerald-500/20 h-12 text-base"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                Best way to reach you?
              </Label>
              <div className="flex gap-4">
                <ToggleCard
                  icon={XIcon}
                  title="X DM"
                  selected={contactValue === "twitter"}
                  onClick={() => setValue("contact", "twitter")}
                />
                <ToggleCard
                  icon={Phone}
                  title="15min Call"
                  selected={contactValue === "call"}
                  onClick={() => setValue("contact", "call")}
                />
              </div>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className="w-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold py-6 text-lg rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Submitting...
                  </span>
                ) : submitSuccess ? (
                  <span className="flex items-center gap-2">
                    ✓ Submitted! We&apos;ll be in touch soon
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Submit Request
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
              <p className="text-center text-xs text-zinc-600 mt-4">
                By submitting, you agree to our Terms of Service. No spam, ever.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
