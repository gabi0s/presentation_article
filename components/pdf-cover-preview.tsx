"use client";

import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export function PdfCoverPreview({
  pdfUrl,
  title,
}: {
  pdfUrl: string;
  title: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;

    async function renderFirstPage() {
      try {
        setStatus("loading");
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 1.55 });
        const canvas = canvasRef.current;
        if (!canvas || cancelled) return;

        const context = canvas.getContext("2d");
        if (!context) {
          throw new Error("Canvas context unavailable");
        }

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;
        if (!cancelled) setStatus("ready");
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    if (pdfUrl) {
      renderFirstPage();
    } else {
      setStatus("error");
    }

    return () => {
      cancelled = true;
    };
  }, [pdfUrl]);

  return (
    <div className="relative h-60 w-full overflow-hidden bg-[var(--surface-soft)] sm:h-64">
      <canvas ref={canvasRef} className="h-full w-full object-cover" />
      {status !== "ready" ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(255,253,249,0.96),rgba(238,243,246,0.9))]">
          <div className="max-w-xs text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
              PDF
            </p>
            <p className="mt-3 font-serif text-2xl leading-tight text-[var(--text-strong)]">
              {title}
            </p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">
              {status === "loading"
                ? "Chargement de l'aperçu"
                : "Aperçu indisponible"}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
