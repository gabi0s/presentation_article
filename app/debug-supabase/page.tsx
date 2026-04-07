import Link from "next/link";
import { getSupabaseDebugInfo } from "@/lib/supabase-debug";

export default async function DebugSupabasePage() {
  const debug = await getSupabaseDebugInfo();

  return (
    <main className="min-h-screen bg-[var(--page-bg)] px-5 py-10 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-5xl space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Diagnostic Supabase
          </p>
          <h1 className="font-serif text-4xl text-[var(--text-strong)]">
            Test de connexion et de lecture
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            Cette page t&apos;indique si le site voit bien Supabase et s&apos;il
            trouve des lignes dans la table <code>articles</code>.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card label="Supabase configuré" value={debug.configured ? "Oui" : "Non"} />
          <Card label="URL présente" value={debug.urlPresent ? "Oui" : "Non"} />
          <Card
            label="Clé publishable présente"
            value={debug.publishableKeyPresent ? "Oui" : "Non"}
          />
          <Card
            label="Nombre de lignes"
            value={debug.rowCount === null ? "Inconnu" : String(debug.rowCount)}
          />
        </div>

        {debug.error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-900">
            Erreur Supabase: {debug.error}
          </div>
        ) : null}

        <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.24)]">
          <h2 className="font-serif text-2xl text-[var(--text-strong)]">
            Exemple de ligne retournée
          </h2>
          {debug.sample ? (
            <pre className="mt-4 overflow-auto rounded-2xl bg-[var(--surface-soft)] p-4 text-xs leading-6 text-[var(--text-primary)]">
              {JSON.stringify(debug.sample, null, 2)}
            </pre>
          ) : (
            <p className="mt-4 text-sm text-[var(--text-muted)]">
              Aucune ligne n&apos;a été retournée par la requête.
            </p>
          )}
        </div>

        <div className="rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.24)]">
          <h2 className="font-serif text-2xl text-[var(--text-strong)]">
            Ce qu&apos;il faut vérifier
          </h2>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-[var(--text-muted)]">
            <li>1. La table s&apos;appelle bien <code>articles</code>.</li>
            <li>2. Les colonnes existent: <code>id</code>, <code>title</code>, <code>summary</code>, <code>author</code>, <code>published_date</code>, <code>pdf_url</code>.</li>
            <li>3. La clé publique est bien celle du projet Supabase courant.</li>
            <li>4. Au moins une ligne est présente dans la table.</li>
          </ul>
        </div>

        <Link
          href="/"
          className="inline-flex rounded-full bg-[var(--text-strong)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
        >
          Retour à l’accueil
        </Link>
      </section>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.24)]">
      <p className="text-xs uppercase tracking-[0.25em] text-[var(--text-muted)]">
        {label}
      </p>
      <p className="mt-3 font-serif text-2xl text-[var(--text-strong)]">{value}</p>
    </div>
  );
}
