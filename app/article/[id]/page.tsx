import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article-card";
import { PdfViewer } from "@/components/pdf-viewer";
import { getArticleByIdOrSlug, getArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

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
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-[1680px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8 xl:py-10">
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--line)] bg-[rgba(255,250,241,0.82)] px-4 py-2 text-sm uppercase tracking-[0.14em] text-[var(--ink-500)] transition hover:text-[var(--ink-950)]"
          >
            Retour a la collection
          </Link>

          <div className="grid gap-6 2xl:grid-cols-[0.95fr_1.05fr]">
            <article className="space-y-6">
              <div className="dark-panel rounded-[2.4rem] border border-white/8 p-6 text-white shadow-[var(--shadow-strong)] sm:p-8 xl:p-10">
                <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/60">
                  <span className="rounded-full bg-white/10 px-2.5 py-1 font-medium text-white">
                    PDF
                  </span>
                  <span>{article.author}</span>
                  <time dateTime={article.published_date}>
                    {new Date(article.published_date).toLocaleDateString("fr-FR")}
                  </time>
                </div>

                <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[0.95] text-white sm:text-5xl xl:text-6xl">
                  {article.title}
                </h1>
                <p className="mt-5 max-w-3xl text-base leading-8 text-white/72 sm:text-lg">
                  {article.summary}
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  {article.pdf_url && article.pdf_url !== "#" ? (
                    <a
                      href={article.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-full bg-[var(--surface-strong)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--ink-950)] transition hover:bg-white"
                    >
                      Telecharger le PDF
                    </a>
                  ) : null}
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white/12"
                  >
                    Revenir aux articles
                  </Link>
                </div>

                <dl className="mt-8 grid gap-4 border-t border-white/10 pt-6 text-sm sm:grid-cols-2">
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

              <section className="glass-panel rounded-[2rem] border border-[var(--line)] p-6 shadow-[var(--shadow-soft)] sm:p-8 xl:p-10">
                <p className="eyebrow text-[var(--accent-deep)]">
                  Note de lecture
                </p>
                <h2 className="mt-3 font-serif text-3xl text-[var(--ink-950)]">
                  Previsualisation texte
                </h2>
                <p className="mt-5 max-w-4xl whitespace-pre-line text-sm leading-8 text-[var(--ink-500)] sm:text-base">
                  {article.content ??
                    article.summary ??
                    "Apercu non disponible pour cet article."}
                </p>
              </section>
            </article>

            <aside className="space-y-6 2xl:sticky 2xl:top-8 2xl:self-start">
              {article.pdf_url && article.pdf_url !== "#" ? (
                <PdfViewer pdfUrl={article.pdf_url} />
              ) : null}

              <section className="glass-panel rounded-[2rem] border border-[var(--line)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="eyebrow text-[var(--accent-deep)]">
                      Suite de lecture
                    </p>
                    <h2 className="mt-3 font-serif text-3xl text-[var(--ink-950)]">
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
                    <p className="text-sm leading-6 text-[var(--ink-500)]">
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
    <div className="rounded-[1.4rem] border border-white/10 bg-white/6 p-4">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/54">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-medium leading-6 text-white">
        {value}
      </dd>
    </div>
  );
}

