import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { ArticleExplorer } from "@/components/article-explorer";
import { getArticles } from "@/lib/articles";

export default async function Home() {
  const articles = await getArticles();
  const latestArticle = articles[0] ?? null;

  return (
    <main className="min-h-screen bg-[var(--page-bg)] text-[var(--text-primary)]">
      <section className="mx-auto flex w-full max-w-[1480px] flex-col gap-8 px-4 py-6 sm:px-6 sm:py-8 xl:px-8 xl:py-10">
        <header className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[linear-gradient(135deg,rgba(255,253,249,0.96),rgba(247,239,228,0.92))] p-6 shadow-[var(--shadow-soft)] sm:p-8 xl:p-10">
            <div className="max-w-4xl space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-[var(--accent)]">
                Bibliotheque editoriale
              </p>
              <h1 className="max-w-4xl font-serif text-5xl leading-none text-[var(--text-strong)] sm:text-6xl xl:text-7xl">
                Baptiste et Clement publient, archivent et partagent leurs PDF
                dans un meme espace.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--text-muted)] sm:text-lg">
                Une interface claire, typographique et rapide pour retrouver un
                article, ouvrir le PDF, puis passer naturellement au suivant.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#collection"
                className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-92"
              >
                Parcourir la collection
              </Link>
              <Link
                href={latestArticle ? `/article/${encodeURIComponent(latestArticle.id)}` : "#"}
                className="inline-flex items-center justify-center rounded-full border border-[var(--border-strong)] bg-white/80 px-5 py-3 text-sm font-medium text-[var(--accent)] transition hover:bg-white"
              >
                Ouvrir le dernier article
              </Link>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[var(--border)] bg-white/90 p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <StatCard label="Auteurs" value="2" detail="Baptiste et Clement" />
              <StatCard
                label="Articles"
                value={String(articles.length)}
                detail="PDF indexés dans Supabase"
              />
              <StatCard
                label="Acces"
                value="Direct"
                detail="Recherche, lecture et telechargement"
              />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-soft)] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
                Derniere mise en avant
              </p>
              <p className="mt-3 font-serif text-3xl leading-tight text-[var(--text-strong)]">
                {latestArticle ? latestArticle.title : "Aucun article pour le moment"}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                {latestArticle
                  ? latestArticle.summary
                  : "Ajoute un premier article pour alimenter la collection."}
              </p>
            </div>
          </aside>
        </header>

        <ArticleExplorer articles={articles} />

        <section id="collection" aria-labelledby="collection-title" className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                Lecture rapide
              </p>
              <h2
                id="collection-title"
                className="mt-2 font-serif text-3xl text-[var(--text-strong)] sm:text-4xl"
              >
                Derniers articles publies
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--text-muted)]">
              Une selection immediate pour entrer dans la collection sans passer
              par les filtres.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {articles.slice(0, 6).map((article) => (
              <ArticleCard key={article.id} article={article} variant="soft" />
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-2 font-serif text-4xl leading-none text-[var(--text-strong)]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">{detail}</p>
    </div>
  );
}
