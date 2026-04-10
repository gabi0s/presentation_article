export function PdfViewer({ pdfUrl }: { pdfUrl: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[rgba(255,250,241,0.94)] shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-[var(--line)] bg-[rgba(20,17,15,0.04)] px-5 py-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--accent-deep)]">
            Lecture
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Aperçu du PDF</p>
        </div>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[var(--ink-950)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--accent-deep)]"
        >
          Ouvrir
        </a>
      </div>
      <iframe
        title="Lecteur PDF"
        src={pdfUrl}
        className="h-[60vh] w-full bg-white sm:h-[68vh] xl:h-[78vh]"
      />
    </div>
  );
}
