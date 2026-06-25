import { cn } from "@/lib/utils";

type Variant =
  | "high"
  | "moderate"
  | "low"
  | "success"
  | "neutral"
  | "amber"
  | "blue"
  | "indigo";

const styles: Record<Variant, string> = {
  high: "bg-[#C03546]/10 text-[#C03546] border-[#C03546]/20",
  moderate: "bg-[#F5A800]/12 text-[#9a6a00] border-[#F5A800]/30",
  low: "bg-[#828282]/10 text-[#5a5a5a] border-[#828282]/20",
  success: "bg-[#05AB8C]/10 text-[#05AB8C] border-[#05AB8C]/25",
  neutral: "bg-[#011E41]/[0.06] text-[#011E41] border-[#011E41]/10",
  amber: "bg-[#F5A800]/15 text-[#9a6a00] border-[#F5A800]/35",
  blue: "bg-[#003F9F]/10 text-[#003F9F] border-[#003F9F]/25",
  indigo: "bg-[#011E41] text-white border-transparent",
};

export function Badge({
  variant = "neutral",
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
