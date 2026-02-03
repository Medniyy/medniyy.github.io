"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, Video, Mail, Loader2 } from "lucide-react";

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

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xwvqnqno";

const formSchema = z.object({
  project: z.string().min(3, "Project name or link is required"),
  goal: z.enum(["audit", "specific"]),
  needs: z.string().optional(),
  timeline: z.string().optional(),
  revenue: z.string().optional(),
  contact: z.string().optional(),
  email: z.string().email("Valid email required"),
  telegramHandle: z.string().optional(),
  xHandle: z.string().optional(),
  callLink: z.string().optional(),
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
    <div className="flex flex-col sm:flex-row gap-6 sm:gap-3 w-full max-w-[95%] sm:max-w-none mx-auto sm:mx-0">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={`flex-1 min-h-[48px] h-12 py-2.5 px-4 text-sm font-medium rounded-lg border transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
            value === option
              ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
              : "bg-zinc-900/30 border-white/10 text-zinc-500 hover:bg-zinc-900/50 hover:border-white/20 hover:text-zinc-300"
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
      className={`w-full max-w-[95%] md:max-w-none md:flex-1 md:min-w-0 flex flex-row items-center justify-center gap-2 min-h-[48px] h-12 py-2.5 px-4 rounded-lg border transition-all duration-200 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 active:ring-emerald-500/40 ${
        selected
          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]"
          : "bg-zinc-900/30 border-white/10 text-zinc-400 hover:bg-zinc-900/50 hover:border-white/20"
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
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

function TelegramPaperPlaneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
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
      contact: "email",
    },
  });

  const goalValue = watch("goal");
  const timelineValue = watch("timeline");
  const contactValue = watch("contact");
  const revenueValue = watch("revenue");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          project: data.project,
          goal: data.goal || "Free audit of current media presence",
          needs: data.needs || "",
          timeline: data.timeline || "ASAP",
          revenue: data.revenue || "",
          email: data.email,
          contact: data.contact || "Email",
          telegramHandle: data.telegramHandle || "",
          xHandle: data.xHandle || "",
          callLink: data.callLink || "",
          _subject: `New Media Audit Request: ${data.project}`,
        }),
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 5000);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 md:py-32 bg-zinc-950" id="audit">
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
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 md:space-y-8">
            <div className="space-y-3">
              <Label
                htmlFor="project"
                className="text-xs font-medium text-zinc-400 uppercase tracking-wide"
              >
                PROJECT NAME + LINK *
              </Label>
              <Input
                id="project"
                placeholder="e.g., solana.com or @solana"
                className="bg-zinc-900/50 border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-0 h-12 text-base py-4 px-5 md:py-2 md:px-3 min-h-[44px] placeholder:text-gray-400 placeholder:opacity-80 placeholder:italic"
                {...register("project")}
              />
              {errors.project && (
                <p className="text-red-400 text-sm">{errors.project.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                WHAT ARE YOU LOOKING FOR?
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
                    <div className="mt-4 space-y-2">
                      <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                        Tell us what do you have in mind
                      </Label>
                      <Textarea
                        placeholder="e.g., 'Need hype videos for our token launch', 'X engagement is dead', 'Want AI cinematic clips' 'Need event coverage on site'..."
                        className="bg-zinc-900/50 border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-0 min-h-[120px] py-4 px-5 md:py-2 md:px-3 text-base placeholder:text-gray-400 placeholder:opacity-80 placeholder:italic"
                        {...register("needs")}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                TIMELINE
              </Label>
              <SegmentedControl
                value={timelineValue || "ASAP"}
                onChange={(value) => setValue("timeline", value)}
                options={["ASAP", "2-4 weeks", "Flexible"]}
              />
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-xs font-medium text-zinc-400 uppercase tracking-wide"
              >
                EMAIL *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="bg-zinc-900/50 border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-0 h-12 text-base py-4 px-5 md:py-2 md:px-3 min-h-[44px] text-[16px] md:text-base placeholder:text-gray-400 placeholder:opacity-80 placeholder:italic"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-400 text-sm">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="revenue"
                className="text-xs font-medium text-zinc-400 uppercase tracking-wide"
              >
                MONTHLY REVENUE (OPTIONAL*)
              </Label>
              <Select
                value={revenueValue}
                onValueChange={(value) => setValue("revenue", value)}
              >
                <SelectTrigger className="bg-zinc-900/50 border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-0 h-12 text-base py-4 px-5 md:py-2 md:px-3 min-h-[48px]">
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
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                BEST WAY TO REACH YOU?
              </Label>
              <div className="flex flex-col md:flex-row md:flex-wrap gap-7 md:gap-3 items-center md:items-stretch w-full">
                <ToggleCard
                  icon={Mail}
                  title="Email"
                  selected={contactValue === "email"}
                  onClick={() => setValue("contact", "email")}
                />
                <ToggleCard
                  icon={XIcon}
                  title="X DM"
                  selected={contactValue === "twitter"}
                  onClick={() => setValue("contact", "twitter")}
                />
                <ToggleCard
                  icon={TelegramPaperPlaneIcon}
                  title="Telegram"
                  selected={contactValue === "telegram"}
                  onClick={() => setValue("contact", "telegram")}
                />
                <ToggleCard
                  icon={Video}
                  title="15min Call"
                  selected={contactValue === "call"}
                  onClick={() => setValue("contact", "call")}
                />
              </div>

              <AnimatePresence>
                {contactValue === "twitter" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-2">
                      <Label
                        htmlFor="xHandle"
                        className="text-xs font-medium text-zinc-400 uppercase tracking-wide"
                      >
                        X handle (optional)
                      </Label>
                      <Input
                        id="xHandle"
                        type="text"
                        className="bg-zinc-900/50 border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-0 placeholder:text-gray-400 placeholder:opacity-80 placeholder:italic h-12 text-base py-4 px-5 md:py-2 md:px-3 min-h-[44px]"
                        placeholder="@handle"
                        {...register("xHandle")}
                      />
                    </div>
                  </motion.div>
                )}

                {contactValue === "telegram" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-2">
                      <Label
                        htmlFor="telegramHandle"
                        className="text-xs font-medium text-zinc-400 uppercase tracking-wide"
                      >
                        Telegram handle (optional)
                      </Label>
                      <Input
                        id="telegramHandle"
                        type="text"
                        placeholder="@username"
                        className="bg-zinc-900/50 border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-0 h-12 text-base py-4 px-5 md:py-2 md:px-3 min-h-[44px] placeholder:text-gray-400 placeholder:opacity-80 placeholder:italic"
                        {...register("telegramHandle")}
                      />
                    </div>
                  </motion.div>
                )}

                {contactValue === "call" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-2">
                      <Label
                        htmlFor="callLink"
                        className="text-xs font-medium text-zinc-400 uppercase tracking-wide"
                      >
                        Calendly or other booking link (optional)
                      </Label>
                      <Input
                        id="callLink"
                        type="text"
                        placeholder="Calendly or other booking link"
                        className="bg-zinc-900/50 border-white/10 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40 focus:ring-offset-0 h-12 text-base py-4 px-5 md:py-2 md:px-3 min-h-[44px] placeholder:text-gray-400 placeholder:opacity-80 placeholder:italic"
                        {...register("callLink")}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || submitSuccess}
                className="w-full min-h-[48px] bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-semibold py-6 text-lg rounded-xl shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 hover:scale-[1.02] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 touch-manipulation"
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
                    Get My Free Audit
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
