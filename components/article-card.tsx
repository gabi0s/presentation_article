import Link from "next/link";
import type { Article } from "@/lib/types";
import { PdfCoverPreview } from "@/components/pdf-cover-preview";

export function ArticleCard({
  article,
  variant = "default",
}: {
  article: Article;
  variant?: "default" | "soft" | "compact";
}) {
  const articleHref = `/article/${encodeURIComponent(article.id || article.title)}`;
  const summary = article.summary.slice(0, 160);
  const compact = variant === "compact";
  const soft = variant === "soft";

  return (
    <article
      className={`group overflow-hidden border border-[var(--line)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-strong)] ${
        compact
          ? "rounded-[1.7rem] bg-[rgba(255,250,241,0.76)]"
          : soft
            ? "rounded-[2rem] glass-panel"
            : "rounded-[2rem] bg-[rgba(255,250,241,0.88)]"
      }`}
    >
      <Link href={articleHref} className="block h-full focus:outline-none">
        <div className="relative overflow-hidden border-b border-[var(--line)] bg-[rgba(20,17,15,0.04)]">
          <PdfCoverPreview pdfUrl={article.pdf_url} title={article.title} />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(20,17,15,0.26)] to-transparent" />
          <div className="absolute left-4 top-4 inline-flex items-center rounded-full border border-white/30 bg-[rgba(20,17,15,0.72)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-white">
            PDF
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-[var(--ink-500)]">
            <span>{article.author}</span>
            <time dateTime={article.published_date}>
              {new Date(article.published_date).toLocaleDateString("fr-FR")}
            </time>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-3xl leading-tight text-[var(--ink-950)]">
              {article.title}
            </h3>
            <p className="text-sm leading-6 text-[var(--ink-500)]">
              {summary}
              {article.summary.length > 160 ? "..." : ""}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {article.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-2.5 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-500)]"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <span className="inline-flex shrink-0 items-center rounded-full bg-[var(--ink-950)] px-3.5 py-2 text-xs font-medium uppercase tracking-[0.14em] text-white transition group-hover:bg-[var(--accent-deep)]">
              Ouvrir
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
