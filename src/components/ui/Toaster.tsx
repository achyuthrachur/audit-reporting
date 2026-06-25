"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, AlertCircle } from "lucide-react";
import { useAppStore } from "@/store/appStore";

const STYLES = {
  success: { bg: "bg-success", Icon: CheckCircle2 },
  info: { bg: "bg-blue", Icon: Info },
  error: { bg: "bg-high", Icon: AlertCircle },
} as const;

export function Toaster() {
  const toast = useAppStore((s) => s.toast);
  const clearToast = useAppStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 3200);
    return () => clearTimeout(t);
  }, [toast?.id, toast, clearToast]);

  const style = toast ? STYLES[toast.variant] : null;

  return (
    <div className="no-print pointer-events-none fixed bottom-6 left-1/2 z-[100] -translate-x-1/2">
      <AnimatePresence>
        {toast && style && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25 }}
            className={`flex items-center gap-2 rounded-xl ${style.bg} px-4 py-2.5 text-sm font-semibold text-white shadow-lift`}
          >
            <style.Icon className="h-4 w-4" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
