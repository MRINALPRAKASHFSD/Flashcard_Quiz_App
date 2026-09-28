"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminCMSModal from "../components/AdminCMSModal";
import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center relative">
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Quiz App
        </Link>
        <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
          <Database className="w-4 h-4" /> Full CMS Admin Route
        </div>
      </div>

      <AdminCMSModal
        isOpen={isOpen}
        onClose={() => router.push("/")}
      />
    </div>
  );
}
