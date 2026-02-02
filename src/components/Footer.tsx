import Image from "next/image";
import { links } from "@/lib/constants";

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

export default function Footer() {
  return (
    <footer className="py-12 border-t border-white/5 bg-zinc-950">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="ATH Creative Studio"
                width={40}
                height={40}
                className="object-contain w-10 h-10"
              />
            </div>
            <p className="text-white font-semibold">ATH Creative Studio</p>
          </div>

          <div className="flex gap-8 text-zinc-400 text-sm">
            <a
              href={links.twitterHighlights}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-400 transition-colors font-medium"
            >
              See Our Work
            </a>
            <a
              href={links.twitterFollow}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-emerald-400 transition-colors font-medium"
            >
              <XIcon className="w-4 h-4" />
              Follow on X
            </a>
          </div>

          <p className="text-zinc-600 text-xs">
            © 2026 ATH Creative Studio. Working globally.
          </p>
        </div>
      </div>
    </footer>
  );
}
