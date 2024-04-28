export const MagicBorder = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  return (
    <div className="relative inline-flex overflow-hidden rounded-2xl p-[1.2px] shadow-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 md:p-[1.5px]">
      <span
        style={{
          animationDelay: `${delay}s`,
        }}
        className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#69D9F3_0%,#145463_50%,#69D9F3_100%)]"
      />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-2xl bg-background text-sm font-medium text-foreground backdrop-blur-3xl">
        {children}
      </span>
    </div>
  );
};
