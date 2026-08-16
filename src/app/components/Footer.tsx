"use client";

import Image from "next/image";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <footer className="w-full bg-[#0c0c0c] text-[#f0eeea] border-t border-[#2a2a2a] relative z-[20] mt-auto">
      <div className="w-full px-8 sm:px-16 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.4fr] gap-10 lg:gap-14 items-start">
        {/* Brand Column */}
        <div className="space-y-4">
          <a
            href="https://eozka.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block hover:opacity-90 transition-opacity"
            title="Visit eOzka official website"
          >
            <Image
              src="/eozka-landing-logo.svg"
              alt="eOzka Operational Holding Company"
              width={220}
              height={70}
              className="h-14 sm:h-16 w-auto object-contain block"
              priority
            />
          </a>
          <p className="text-xs text-[#999999] leading-relaxed max-w-sm">
            An operational holding company engaged in the development, management, and provision of
            technology solutions, software infrastructure, digital platforms, consulting services, and community‑driven programs.
          </p>
        </div>

        {/* Ecosystem Column */}
        <div className="space-y-4">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#d4c9a8] font-bold">Ecosystem</h4>
          <ul className="space-y-3 text-[13px] text-[#999999]">
            <li>
              <a href="https://eozka.com/#story" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0eeea] transition-colors">
                Our story
              </a>
            </li>
            <li>
              <a href="https://eozka.com/#showcase" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0eeea] transition-colors">
                Showcase
              </a>
            </li>
            <li>
              <a href="https://eozka.com/members" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0eeea] transition-colors">
                Leadership & Members
              </a>
            </li>
            <li>
              <a href="https://eozka.com/request-meeting" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0eeea] transition-colors">
                Request a meeting
              </a>
            </li>
          </ul>
        </div>

        {/* Connect Column */}
        <div className="space-y-4">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#d4c9a8] font-bold">Connect</h4>
          <ul className="space-y-3 text-[13px] text-[#999999]">
            <li>
              <a href="https://github.com/eOzkull" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0eeea] transition-colors">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://instagram.com/weareeozka" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0eeea] transition-colors">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/company/eozka" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0eeea] transition-colors">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="https://x.com/weareeozka" target="_blank" rel="noopener noreferrer" className="hover:text-[#f0eeea] transition-colors">
                X / Twitter
              </a>
            </li>
            <li>
              <a href="mailto:eozka.hq@gmail.com" className="hover:text-[#f0eeea] transition-colors">
                Email
              </a>
            </li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="space-y-4">
          <h4 className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#d4c9a8] font-bold">Newsletter</h4>
          <p className="text-xs text-[#999999] leading-relaxed">
            Subscribe for technical updates, security disclosures, and project launches from our company.
          </p>
          <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
            <div className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your_email@domain.com"
                required
                className="w-full bg-[#161616] border border-[#333333] rounded-lg px-3.5 py-2 text-xs text-[#f0eeea] placeholder-[#666666] focus:outline-none focus:border-[#d4b23c] transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#f0eeea] hover:bg-white text-[#0c0c0c] text-xs font-bold rounded-lg transition-colors shrink-0"
              >
                SUB
              </button>
            </div>
            {subscribed && (
              <p className="text-[11px] font-mono text-emerald-400 font-medium animate-pulse">
                ✓ Subscribed to eOzka dispatch.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="w-full px-8 sm:px-16 py-6 border-t border-[#1e1e1e] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="font-mono text-[11px] tracking-wider text-[#666666]">© {new Date().getFullYear()} eOzka. All rights reserved.</span>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[#666666]">
          <span className="status-dot" />
          <span>Augmenting Sentient</span>
        </div>
      </div>
    </footer>
  );
}
