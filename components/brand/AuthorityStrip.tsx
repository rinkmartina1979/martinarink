// NURNBERGER_APPROVED — flip to true only when written permission from Mrs. Nürnberger is on file.
// Until then, the clinical partner credential is hidden. Strip renders 3 items (2-col grid).
const NURNBERGER_APPROVED = false;

const ITEMS = [
  { label: "AUTHOR", credit: "Three Books · Spiegel Bestseller" },
  { label: "CULTURAL WORK", credit: "Isabella Blow · London" },
  { label: "LIVED EXPERIENCE", credit: "Six Years Sober" },
  ...(NURNBERGER_APPROVED
    ? [{ label: "CLINICAL PARTNER", credit: "Mrs. Nürnberger · My Way Betty Ford" }]
    : []),
];

export function AuthorityStrip() {
  const cols = ITEMS.length === 4 ? "md:grid-cols-4" : "md:grid-cols-3";
  return (
    <section className="bg-bone border-y border-sand/40">
      <div className="container-content py-8 md:py-10">
        <ul className={`grid grid-cols-2 ${cols} gap-y-6 md:gap-y-0 md:divide-x divide-sand/60`}>
          {ITEMS.map((item) => (
            <li
              key={item.label}
              className="flex flex-col items-center text-center px-4"
            >
              <span className="text-[0.6875rem] uppercase tracking-[0.22em] font-medium text-ink-quiet">
                {item.label}
              </span>
              <span className="mt-2 font-[family-name:var(--font-display)] text-[15px] text-ink leading-tight">
                {item.credit}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
