export function PdfViewer({ pdfUrl }: { pdfUrl: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-white shadow-[var(--shadow-soft)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface-soft)] px-5 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--accent)]">
            Lecture
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">Aperçu du PDF</p>
        </div>
        <a
          href={pdfUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-white px-4 py-2 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--surface)]"
        >
          Ouvrir
        </a>
      </div>
      <iframe
        title="Lecteur PDF"
        src={pdfUrl}
        className="h-[60vh] w-full sm:h-[68vh] xl:h-[78vh]"
      />
    </div>
  );
}
