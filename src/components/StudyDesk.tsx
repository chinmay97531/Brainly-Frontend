export function StudyDesk() {
  return (
    <div className="relative mx-auto mt-10 w-full max-w-md">
      <div className="absolute -left-2 top-8 w-40 rotate-[-4deg] rounded-sm border border-[#e3d7c4] bg-[#fff9ee] p-3 shadow-[2px_3px_0_rgba(28,25,23,0.06)]">
        <p className="font-hand text-lg leading-5 text-brand">watch later</p>
        <p className="mt-2 text-[11px] leading-4 text-stone-500">
          CS lecture · queues
          <br />
          18:40 bookmark
        </p>
        <span className="mt-3 inline-block rounded-sm bg-brand/10 px-1.5 py-0.5 text-[10px] font-medium text-brand">
          YouTube
        </span>
      </div>

      <div className="relative ml-24 rounded-md border border-[#ddd2bf] bg-[#fffdf8] p-4 pt-5 shadow-[3px_4px_0_rgba(28,25,23,0.05)]">
        <div className="absolute left-0 right-0 top-0 h-2 bg-[#d9cbb6]" />
        <div className="space-y-2.5">
          <div className="h-2 w-3/4 rounded-sm bg-stone-200" />
          <div className="h-2 w-full rounded-sm bg-stone-200" />
          <div className="h-2 w-5/6 rounded-sm bg-stone-200" />
          <div className="h-2 w-2/3 rounded-sm bg-brand/25" />
          <div className="h-2 w-full rounded-sm bg-stone-200" />
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-dashed border-stone-300 pt-3">
          <span className="flex size-7 items-center justify-center rounded-full border border-stone-300 text-[10px] text-stone-600">
            ▶
          </span>
          <div>
            <p className="text-xs font-semibold text-ink">Design systems 101</p>
            <p className="text-[11px] text-stone-500">saved to BrainBox</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-1 bottom-6 w-36 rotate-[3deg] rounded-sm bg-[#f3e27a] px-3 py-2.5 shadow-[2px_2px_0_rgba(28,25,23,0.08)]">
        <p className="font-hand text-[22px] leading-6 text-ink">idea:</p>
        <p className="mt-1 text-[11px] leading-4 text-stone-700">
          collect tweets
          <br />
          before they vanish
        </p>
      </div>

      <svg
        className="absolute -bottom-3 left-16 text-brand/70"
        width="72"
        height="28"
        viewBox="0 0 72 28"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M3 18c8-9 16 6 26 1 9-4 14 6 26-2 6-4 11-1 14 2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
