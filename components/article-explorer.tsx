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
      className="glass-panel rounded-[2.2rem] border border-[var(--line)] p-4 shadow-[var(--shadow-soft)] sm:p-6 xl:p-8"
    >
      <div className="grid gap-5 border-b border-[var(--line)] pb-6 xl:grid-cols-[1.1fr_0.9fr] xl:items-end">
        <div className="space-y-3">
          <p className="eyebrow text-[var(--accent-deep)]">
            Outils de lecture
          </p>
          <h2
            id="article-explorer-title"
            className="font-serif text-3xl leading-tight text-[var(--ink-950)] sm:text-4xl"
          >
            Retrouve un article par titre, auteur ou date.
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--ink-500)]">
            Le module reste utilitaire, mais avec une presence visuelle plus premium et mieux
            integree au reste du site.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <OverviewCard label="Articles" value={String(articles.length)} />
          <OverviewCard label="Auteurs" value={String(authors.length)} />
          <OverviewCard label="Derniere date" value={latestDate} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-[1.45fr_0.7fr_0.7fr_auto]">
        <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.62)] px-4 py-3">
          <SearchIcon />
          <span className="sr-only">Recherche d&apos;articles</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher par titre, resume ou mot-cle"
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--ink-500)]"
          />
        </label>

        <select
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.62)] px-4 py-3 text-sm outline-none"
          aria-label="Filtrer par auteur"
        >
          <option value="all">Tous les auteurs</option>
          {authors.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as "recent" | "oldest")}
          className="rounded-2xl border border-[var(--line)] bg-[rgba(255,255,255,0.62)] px-4 py-3 text-sm outline-none"
          aria-label="Trier par date"
        >
          <option value="recent">Plus recents d&apos;abord</option>
          <option value="oldest">Plus anciens d&apos;abord</option>
        </select>

        <div className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[rgba(20,17,15,0.05)] p-1">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`rounded-xl px-3 py-2 text-sm transition ${
              viewMode === "grid"
                ? "bg-white text-[var(--ink-950)] shadow-sm"
                : "text-[var(--ink-500)]"
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
                ? "bg-white text-[var(--ink-950)] shadow-sm"
                : "text-[var(--ink-500)]"
            }`}
            aria-pressed={viewMode === "list"}
          >
            Liste
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 text-sm text-[var(--ink-500)] sm:flex-row sm:items-center sm:justify-between">
        <p>
          {filteredArticles.length} article(s) correspondent a la recherche en
          cours.
        </p>
        <Link
          href="#collection"
          className="rounded-full border border-transparent px-3 py-1.5 transition hover:border-[var(--line)] hover:text-[var(--ink-950)]"
        >
          Retour a la selection
        </Link>
      </div>

      <div
        className={`mt-6 ${
          viewMode === "grid"
            ? "grid gap-5 lg:grid-cols-3"
            : "grid gap-4"
        }`}
      >
        {filteredArticles.map((article) =>
          viewMode === "grid" ? (
            <ArticleCard key={article.id} article={article} />
          ) : (
            <article
              key={article.id}
              className="rounded-[1.8rem] border border-[var(--line)] bg-[rgba(255,250,241,0.82)] p-5 transition hover:shadow-[var(--shadow-soft)]"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--ink-500)]">
                    <span className="rounded-full bg-[rgba(255,255,255,0.72)] px-2.5 py-1 font-medium text-[var(--ink-500)]">
                      PDF
                    </span>
                    <span>{article.author}</span>
                    <time dateTime={article.published_date}>
                      {new Date(article.published_date).toLocaleDateString("fr-FR")}
                    </time>
                  </div>
                  <Link href={`/article/${encodeURIComponent(article.id || article.title)}`}>
                    <h3 className="font-serif text-3xl leading-tight text-[var(--ink-950)]">
                      {article.title}
                    </h3>
                  </Link>
                  <p className="max-w-3xl text-sm leading-7 text-[var(--ink-500)]">
                    {article.summary}
                  </p>
                </div>

                <Link
                  href={`/article/${encodeURIComponent(article.id || article.title)}`}
                  className="inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--ink-950)] px-4 py-2.5 text-sm font-medium uppercase tracking-[0.14em] text-white transition hover:bg-[var(--accent-deep)]"
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
    <div className="rounded-[1.4rem] border border-[var(--line)] bg-[rgba(255,255,255,0.5)] px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--ink-500)]">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl leading-none text-[var(--ink-950)]">
        {value}
      </p>
    </div>
  );
}

