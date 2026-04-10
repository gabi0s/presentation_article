"use client";

import { useState } from "react";

const AUTHORS = [
  {
    id: "baptiste",
    name: "Baptiste",
    role: "Etudiant auteur",
    lead: "Une ecriture structuree, orientee clarification et transmission.",
    bio:
      "Ses articles privilegient la lisibilite, la progression des idees et une approche editoriale sobre.",
    points: ["Analyse", "Structure", "Synthese"],
  },
  {
    id: "clement",
    name: "Clement",
    role: "Etudiant auteur",
    lead: "Une voix plus directe, concentree sur le fond et la precision.",
    bio:
      "Ses contributions mettent l'accent sur la rigueur, la selection des sources et la mise en perspective.",
    points: ["Rigueur", "Selection", "Perspective"],
  },
] as const;

export function AuthorsShowcase() {
  const [activeId, setActiveId] = useState<(typeof AUTHORS)[number]["id"]>("baptiste");
  const activeAuthor = AUTHORS.find((author) => author.id === activeId) ?? AUTHORS[0];

  return (
    <section className="glass-panel rounded-[2.2rem] border border-[var(--line)] p-6 shadow-[var(--shadow-soft)] sm:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow text-[var(--accent-deep)]">Auteurs</p>
          <h2 className="mt-3 font-serif text-4xl leading-tight text-[var(--ink-950)]">
            Deux etudiants, une meme exigence editoriale.
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--ink-500)]">
            La section presente les deux auteurs de la collection dans un seul encadre,
            avec une bascule simple pour passer de l&apos;un a l&apos;autre.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-2xl border border-[var(--line)] bg-[rgba(20,17,15,0.05)] p-1">
          {AUTHORS.map((author) => (
            <button
              key={author.id}
              type="button"
              onClick={() => setActiveId(author.id)}
              className={`rounded-xl px-4 py-2 text-sm transition ${
                activeId === author.id
                  ? "bg-white text-[var(--ink-950)] shadow-sm"
                  : "text-[var(--ink-500)]"
              }`}
              aria-pressed={activeId === author.id}
            >
              {author.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[1.8rem] border border-[var(--line)] bg-[rgba(255,255,255,0.58)] p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--ink-500)]">
            Profil
          </p>
          <h3 className="mt-4 font-serif text-4xl text-[var(--ink-950)]">{activeAuthor.name}</h3>
          <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[var(--ink-500)]">
            {activeAuthor.role}
          </p>
        </div>

        <div className="rounded-[1.8rem] border border-[var(--line)] bg-[rgba(255,255,255,0.4)] p-6">
          <p className="font-serif text-3xl leading-tight text-[var(--ink-950)]">
            {activeAuthor.lead}
          </p>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-500)]">
            {activeAuthor.bio}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {activeAuthor.points.map((point) => (
              <span
                key={point}
                className="rounded-full border border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-[var(--ink-500)]"
              >
                {point}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
