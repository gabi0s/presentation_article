import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { ArticleExplorer } from "@/components/article-explorer";
import { getArticles } from "@/lib/articles";

export const dynamic = "force-dynamic";

export default async function Home() {
  const articles = await getArticles();
  const latestArticle = articles[0] ?? null;
  const featuredArticle = articles[1] ?? latestArticle;

  return (
    <main className="min-h-screen text-[var(--ink-700)]">
      <section className="mx-auto flex w-full max-w-[1520px] flex-col gap-8 px-4 py-5 sm:px-6 xl:px-8">
        <header className="editorial-shell dark-panel relative overflow-hidden rounded-[2.5rem] border border-white/10 px-6 py-6 text-white shadow-[var(--shadow-strong)] sm:px-8 sm:py-8 xl:px-10 xl:py-10">
          <div className="hero-orbit -left-20 top-10 h-56 w-56" />
          <div className="hero-orbit right-10 top-16 h-40 w-40" />
          <div className="hero-orbit bottom-[-4rem] left-[32%] h-52 w-52" />
          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr] xl:items-end">
            <div className="glass-panel relative rounded-[2rem] border border-white/12 p-6 text-[var(--ink-800)] shadow-[var(--shadow-soft)] sm:p-8 xl:p-10">
            <div className="max-w-4xl space-y-5">
              <p className="eyebrow text-[var(--accent-deep)]">
                Revue numerique
              </p>
              <h1 className="max-w-4xl font-serif text-5xl leading-[0.92] text-[var(--ink-950)] sm:text-6xl xl:text-7xl">
                Une bibliotheque editoriale avec plus de caractere, moins d&apos;effet template.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--ink-500)] sm:text-lg">
                Le site adopte une direction plus proche d&apos;une revue premium: contraste,
                respiration, hierarchie nette et lecture mieux cadencee.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="#collection"
                  className="inline-flex items-center justify-center rounded-full bg-[var(--surface-strong)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink-950)] shadow-[0_12px_30px_-18px_rgba(20,17,15,0.5)] transition hover:bg-white"
                >
                  Explorer la collection
                </Link>
              <Link
                href={latestArticle ? `/article/${encodeURIComponent(latestArticle.id)}` : "#"}
                className="inline-flex items-center justify-center rounded-full border border-[var(--line)] bg-white/70 px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--ink-950)] transition hover:bg-white"
              >
                Lire l&apos;edition recente
              </Link>
            </div>
          </div>

          <aside className="glass-panel rounded-[2rem] border border-white/12 p-6 text-[var(--ink-800)] shadow-[var(--shadow-soft)] sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              <StatCard label="Auteurs" value="2" detail="Deux voix editoriales" />
              <StatCard
                label="Articles"
                value={String(articles.length)}
                detail="PDF indexés dans Supabase"
              />
              <StatCard
                label="Acces"
                value="Instantane"
                detail="Navigation, lecture et consultation"
              />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.52)] p-5">
              <p className="eyebrow text-[var(--accent-deep)]">
                Mise en avant
              </p>
              <p className="mt-3 font-serif text-3xl leading-tight text-[var(--ink-950)]">
                {featuredArticle ? featuredArticle.title : "Selection editoriale"}
              </p>
              <p className="mt-2 text-sm leading-6 text-[var(--ink-500)]">
                {featuredArticle
                  ? featuredArticle.summary
                  : "Une mise en avant apparait ici automatiquement des qu'un article est publie."}
              </p>
            </div>
          </aside>
          </div>
        </header>

        <ArticleExplorer articles={articles} />

        <section id="collection" aria-labelledby="collection-title" className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[var(--accent-deep)]">
                Selection recente
              </p>
              <h2
                id="collection-title"
                className="mt-3 font-serif text-4xl leading-tight text-[var(--ink-950)] sm:text-5xl"
              >
                Les articles qui donnent le ton.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-[var(--ink-500)]">
              Une entree rapide dans la collection avec une hierarchie plus forte et une
              presence plus editoriale.
            </p>
          </div>

          {articles.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
              {articles.slice(0, 6).map((article) => (
                <ArticleCard key={article.id} article={article} variant="soft" />
              ))}
            </div>
          ) : (
            <div className="glass-panel rounded-[2rem] border border-[var(--line)] p-8 text-center shadow-[var(--shadow-soft)]">
              <p className="eyebrow text-[var(--accent-deep)]">Collection</p>
              <p className="mt-4 font-serif text-3xl text-[var(--ink-950)]">
                Aucun article n&apos;est disponible pour le moment.
              </p>
              <p className="mt-3 text-sm leading-6 text-[var(--ink-500)]">
                La collection sera affichee ici des la prochaine publication.
              </p>
            </div>
          )}
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
    <div className="rounded-[1.5rem] border border-[var(--line)] bg-[rgba(255,255,255,0.58)] p-5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[var(--ink-500)]">
        {label}
      </p>
      <p className="mt-2 font-serif text-4xl leading-none text-[var(--ink-950)]">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--ink-500)]">{detail}</p>
    </div>
  );
}

