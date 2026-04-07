import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--page-bg)] px-6">
      <div className="max-w-xl rounded-[2rem] border border-[var(--border)] bg-white p-8 text-center shadow-[0_20px_60px_-40px_rgba(15,23,42,0.35)]">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--accent)]">
          Article introuvable
        </p>
        <h1 className="mt-4 font-serif text-4xl text-[var(--text-strong)]">
          Cette page n&apos;existe pas
        </h1>
        <p className="mt-3 text-[var(--text-muted)]">
          Le lien est peut-être incorrect, ou l&apos;article a été retiré.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-full bg-[var(--text-strong)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}
