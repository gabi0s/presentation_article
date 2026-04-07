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

  const wrapperClass =
    variant === "compact"
      ? "rounded-[1.6rem]"
      : "rounded-[1.9rem]";

  return (
    <article
      className={`${wrapperClass} group overflow-hidden border border-[var(--border)] bg-[linear-gradient(180deg,rgba(255,253,249,0.98),rgba(238,243,246,0.85))] shadow-[var(--shadow-soft)] transition duration-300 hover:-translate-y-1`}
    >
      <Link href={articleHref} className="block h-full focus:outline-none">
        <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--surface-soft)]">
          <PdfCoverPreview pdfUrl={article.pdf_url} title={article.title} />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(24,36,51,0.16)] to-transparent" />
          <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--accent)]">
            PDF
          </div>
        </div>

        <div className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3 text-xs text-[var(--text-muted)]">
            <span>{article.author}</span>
            <time dateTime={article.published_date}>
              {new Date(article.published_date).toLocaleDateString("fr-FR")}
            </time>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-3xl leading-tight text-[var(--text-strong)]">
              {article.title}
            </h3>
            <p className="text-sm leading-6 text-[var(--text-muted)]">
              {summary}
              {article.summary.length > 160 ? "..." : ""}
            </p>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {article.keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-[var(--border)] bg-white/80 px-2.5 py-1 text-[11px] text-[var(--text-muted)]"
                >
                  {keyword}
                </span>
              ))}
            </div>

            <span className="inline-flex shrink-0 items-center rounded-full bg-[var(--accent)] px-3.5 py-2 text-xs font-medium text-white transition group-hover:opacity-92">
              Ouvrir
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
