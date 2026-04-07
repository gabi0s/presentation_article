import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { PdfViewer } from "@/components/pdf-viewer";
import { getArticleByIdOrSlug, getArticles } from "@/lib/articles";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleByIdOrSlug(id);

  if (!article) {
    notFound();
  }

  const articles = await getArticles();
  const similarArticles = articles
    .filter((item) => item.id !== article.id)
    .filter(
      (item) =>
        item.author === article.author ||
        item.keywords.some((keyword) => article.keywords.includes(keyword))
    )
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[var(--page-bg)]">
      <section className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8 xl:py-10">
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-white/90 px-4 py-2 text-sm text-[var(--text-muted)] transition hover:text-[var(--text-strong)]"
          >
            Retour a la collection
          </Link>

          <div className="grid gap-6 2xl:grid-cols-[0.95fr_1.05fr]">
            <article className="space-y-6">
              <div className="rounded-[2rem] border border-[var(--border)] bg-white/95 p-6 shadow-[var(--shadow-soft)] sm:p-8 xl:p-10">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                  <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 font-medium text-[var(--accent)]">
                    PDF
                  </span>
                  <span>{article.author}</span>
                  <time dateTime={article.published_date}>
                    {new Date(article.published_date).toLocaleDateString("fr-FR")}
                  </time>
                </div>

                <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[0.98] text-[var(--text-strong)] sm:text-5xl xl:text-6xl">
                  {article.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--text-muted)] sm:text-lg">
                  {article.summary}
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {article.pdf_url && article.pdf_url !== "#" ? (
                    <a
                      href={article.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-92"
                    >
                      Télécharger le PDF
                    </a>
                  ) : null}
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] bg-[var(--surface-accent)] px-5 py-3 text-sm font-medium text-[var(--accent)] transition hover:bg-white"
                  >
                    Revenir aux articles
                  </Link>
                </div>

                <dl className="mt-8 grid gap-4 border-t border-[var(--border)] pt-6 text-sm sm:grid-cols-2">
                  <InfoItem label="Auteur" value={article.author} />
                  <InfoItem
                    label="Date"
                    value={new Date(article.published_date).toLocaleDateString("fr-FR")}
                  />
                  <InfoItem
                    label="Mots-cles"
                    value={article.keywords.length > 0 ? article.keywords.join(", ") : "Aucun"}
                  />
                  <InfoItem
                    label="Disponibilite"
                    value={article.pdf_url ? "PDF disponible" : "PDF indisponible"}
                  />
                </dl>
              </div>

              <section className="rounded-[2rem] border border-[var(--border)] bg-white/95 p-6 shadow-[var(--shadow-soft)] sm:p-8 xl:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                  Note de lecture
                </p>
                <h2 className="mt-3 font-serif text-3xl text-[var(--text-strong)]">
                  Prévisualisation texte
                </h2>
                <p className="mt-5 max-w-4xl whitespace-pre-line text-sm leading-8 text-[var(--text-muted)] sm:text-base">
                  {article.content ??
                    article.summary ??
                    "Aperçu non disponible pour cet article."}
                </p>
              </section>
            </article>

            <aside className="space-y-6 2xl:sticky 2xl:top-8 2xl:self-start">
              {article.pdf_url && article.pdf_url !== "#" ? (
                <PdfViewer pdfUrl={article.pdf_url} />
              ) : null}

              <section className="rounded-[2rem] border border-[var(--border)] bg-white/95 p-6 shadow-[var(--shadow-soft)] sm:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                      Suite de lecture
                    </p>
                    <h2 className="mt-3 font-serif text-3xl text-[var(--text-strong)]">
                      Articles similaires
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  {similarArticles.length > 0 ? (
                    similarArticles.map((item) => (
                      <ArticleCard key={item.id} article={item} variant="compact" />
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-[var(--text-muted)]">
                      Aucun article similaire pour le moment.
                    </p>
                  )}
                </div>
              </section>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-soft)] p-4">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium leading-6 text-[var(--text-strong)]">
        {value}
      </dd>
    </div>
  );
}
