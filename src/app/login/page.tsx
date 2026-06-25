"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Compass, ShieldCheck, FileEdit } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore, type Role } from "@/store/appStore";
import { saveRole } from "@/lib/persistence";

const ROLE_CARDS: {
  role: Exclude<Role, null>;
  title: string;
  desc: string;
  Icon: typeof ShieldCheck;
}[] = [
  {
    role: "director",
    title: "Log in as Audit Director",
    desc: "Review reports · Approve",
    Icon: ShieldCheck,
  },
  {
    role: "manager",
    title: "Log in as Audit Manager",
    desc: "Build knowledge base · Draft reports",
    Icon: FileEdit,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const setRole = useAppStore((s) => s.setRole);

  const signIn = (role: Exclude<Role, null>) => {
    setRole(role);
    saveRole(role);
    router.push("/audits");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-indigo-dark px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md rounded-2xl bg-surface p-8 shadow-2xl"
      >
        {/* Brand row */}
        <div className="mb-7 flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/crowe-logo.svg" alt="Crowe" className="h-7 w-auto" />
          <span className="h-6 w-px bg-indigo-dark/15" />
          <span className="flex items-center gap-1.5 font-display text-lg font-bold tracking-tight text-indigo-dark">
            <Compass className="h-5 w-5 text-amber" />
            Compass<span className="text-amber">â„¢</span>
          </span>
        </div>

        <p className="mb-1 text-sm font-medium text-gray-text">
          Meridian National Bank · Internal Audit
        </p>
        <h1 className="font-display text-2xl font-bold text-indigo-dark">
          Sign in
        </h1>
        <p className="mb-6 mt-1 text-sm text-gray-text">
          Choose a demo account to continue
        </p>

        <div className="space-y-3">
          {ROLE_CARDS.map(({ role, title, desc, Icon }) => (
            <button
              key={role}
              type="button"
              onClick={() => signIn(role)}
              className="group flex w-full items-center gap-4 rounded-xl border border-indigo-dark/10 bg-surface p-4 text-left transition hover:-translate-y-0.5 hover:border-amber hover:shadow-lift"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-dark/[0.06] text-indigo-dark transition group-hover:bg-amber/15 group-hover:text-[#9a6a00]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold text-indigo-dark">
                  {title}
                </span>
                <span className="block text-xs text-gray-text">{desc}</span>
              </span>
              <ArrowRight className="h-4 w-4 text-gray-text transition group-hover:translate-x-1 group-hover:text-amber" />
            </button>
          ))}
        </div>

        {/* Manual sign-in (visual only) */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-indigo-dark/10" />
          <span className="text-xs text-gray-text">or sign in manually</span>
          <div className="h-px flex-1 bg-indigo-dark/10" />
        </div>
        <div className="space-y-2 opacity-50">
          <input
            disabled
            placeholder="name@meridiannational.com"
            className="w-full cursor-not-allowed rounded-lg border border-indigo-dark/10 bg-canvas px-3 py-2 text-sm"
          />
          <input
            disabled
            type="password"
            placeholder="Password"
            className="w-full cursor-not-allowed rounded-lg border border-indigo-dark/10 bg-canvas px-3 py-2 text-sm"
          />
        </div>

        <p className="mt-7 text-center text-[11px] text-gray-text">
          All data is synthetic · Demo build · © 2026 Crowe LLP
        </p>
      </motion.div>
    </main>
  );
}
