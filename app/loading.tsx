export default function Loading() {
  return (
    <div className="bg-cream min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p
          className="font-[family-name:var(--font-display)] text-[20px] tracking-[0.12em] text-ink/40"
          style={{ animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite" }}
        >
          MARTINA RINK<span className="text-pink">.</span>
        </p>
      </div>
    </div>
  );
}
