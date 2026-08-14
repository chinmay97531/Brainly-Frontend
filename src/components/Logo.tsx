interface LogoProps {
  light?: boolean;
  size?: "sm" | "md";
}

export function Logo({ light = false, size = "md" }: LogoProps) {
  const mark = size === "sm" ? "size-8" : "size-10";
  const text = size === "sm" ? "text-lg" : "text-[1.35rem]";

  return (
    <div className="flex items-center gap-2.5">
      <img
        src="/brainbox.png"
        alt="BrainBox"
        className={`${mark} rounded-lg object-cover`}
      />
      <span className={`${text} font-semibold tracking-tight ${light ? "text-cream" : "text-ink"}`}>
        BrainBox
      </span>
    </div>
  );
}
