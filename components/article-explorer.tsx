"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Article } from "@/lib/types";
import { ArticleCard } from "@/components/article-card";

type ViewMode = "grid" | "list";

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M21 21l-4.25-4.25M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ArticleExplorer({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [author, setAuthor] = useState("all");
  const [sort, setSort] = useState<"recent" | "oldest">("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return [...articles]
      .filter((article) => {
        const haystack = [
          article.title,
          article.summary,
          article.author,
          ...(article.keywords ?? []),
        ]
          .join(" ")
          .toLowerCase();

        const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
        const matchesAuthor = author === "all" || article.author === author;
        return matchesQuery && matchesAuthor;
      })
      .sort((a, b) => {
        const delta =
          new Date(a.published_date).getTime() - new Date(b.published_date).getTime();
        return sort === "recent" ? -delta : delta;
      });
  }, [articles, author, query, sort]);

  const authors = Array.from(new Set(articles.map((article) => article.author)));
  const latestDate =
    articles.length > 0
      ? new Date(
          Math.max(
            ...articles.map((article) => new Date(article.published_date).getTime())
          )
        ).toLocaleDateString("fr-FR")
      : "N/A";

  return (
    <section
      aria-labelledby="article-explorer-title"
      className="rounded-[2rem] border border-[var(--border)] bg-white/90 p-4 shadow-[var(--shadow-soft)] sm:p-6 xl:p-8"
    >
      <div className="grid gap-5 border-b border-[var(--border)] pb-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            Outils de lecture
          </p>
          <h2
            id="article-explorer-title"
            className="font-serif text-3xl leading-tight text-[var(--text-strong)] sm:text-4xl"
          >
            Retrouvez un article par titre, auteur ou date.
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-[var(--text-muted)]">
            La recherche filtre en direct et la bascule de vue permet de passer
            d&apos;une lecture editoriale a une lecture utilitaire sans changer
            de page.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <OverviewCard label="Articles" value={String(articles.length)} />
          <OverviewCard label="Auteurs" value={String(authors.length)} />
          <OverviewCard label="Derniere date" value={latestDate} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.45fr_0.7fr_0.7fr_auto]">
        <label className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3">
          <SearchIcon />
          <span className="sr-only">Recherche d&apos;articles</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher par titre, resume ou mot-cle"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-muted)]"
          />
        </label>

        <select
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none"
          aria-label="Filtrer par auteur"
        >
          <option value="all">Tous les auteurs</option>
          <option value="Baptiste">Baptiste</option>
          <option value="Clément">Clément</option>
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as "recent" | "oldest")}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm outline-none"
          aria-label="Trier par date"
        >
          <option value="recent">Plus recents d&apos;abord</option>
          <option value="oldest">Plus anciens d&apos;abord</option>
        </select>

        <div className="flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] p-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded-xl px-3 py-2 text-sm transition ${
              viewMode === "grid"
                ? "bg-white text-[var(--accent)] shadow-sm"
                : "text-[var(--text-muted)]"
            }`}
            aria-pressed={viewMode === "grid"}
          >
            Grille
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={`rounded-xl px-3 py-2 text-sm transition ${
              viewMode === "list"
                ? "bg-white text-[var(--accent)] shadow-sm"
                : "text-[var(--text-muted)]"
            }`}
            aria-pressed={viewMode === "list"}
          >
            Liste
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 text-sm text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          {filteredArticles.length} article(s) correspondent a la recherche en
          cours.
        </p>
        <Link
          href="#collection"
          className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-[var(--border)] hover:text-[var(--text-strong)]"
        >
          Retour a la selection
        </Link>
      </div>

      <div
        className={`mt-6 ${
          viewMode === "grid"
            ? "grid gap-5 md:grid-cols-2 2xl:grid-cols-3"
            : "grid gap-4"
        }`}
      >
        {filteredArticles.map((article) =>
          viewMode === "grid" ? (
            <ArticleCard key={article.id} article={article} />
          ) : (
            <article
              key={article.id}
              className="rounded-[1.6rem] border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                    <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 font-medium text-[var(--accent)]">
                      PDF
                    </span>
                    <span>{article.author}</span>
                    <time dateTime={article.published_date}>
                      {new Date(article.published_date).toLocaleDateString("fr-FR")}
                    </time>
                  </div>
                  <Link href={`/article/${encodeURIComponent(article.id || article.title)}`}>
                    <h3 className="font-serif text-3xl leading-tight text-[var(--text-strong)]">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="max-w-3xl text-sm leading-6 text-[var(--text-muted)]">
                    {article.summary}
                  </p>
                </div>

                <Link
                  href={`/article/${encodeURIComponent(article.id || article.title)}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-92"
                >
                  Ouvrir
                </Link>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}

function OverviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl leading-none text-[var(--text-strong)]">
        {value}
      </p>
    </div>
  );
}
