export function AppMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5" aria-label="Daloy">
      <svg className="size-7 shrink-0 text-sandstone" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 9.25h10.2c2.4 0 3.2-3.25 5.55-3.25H24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M4 18.75h10.2c2.4 0 3.2 3.25 5.55 3.25H24" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="4" cy="9.25" r="2" fill="currentColor" />
        <circle cx="4" cy="18.75" r="2" fill="currentColor" />
      </svg>
      {compact ? null : <span className="text-base font-semibold tracking-[-0.02em] text-ivory">Daloy</span>}
    </div>
  );
}
