import { createArticle } from "@/lib/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[var(--page-bg)] px-5 py-10 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
            Administration
          </p>
          <h1 className="font-serif text-4xl text-[var(--text-strong)]">
            Ajouter un nouvel article
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-[var(--text-muted)]">
            Cette page envoie le PDF vers le bucket Supabase Storage
            <code className="rounded bg-white px-1.5 py-0.5">articles-pdf</code>
            puis crée la ligne dans la table <code>articles</code>.
          </p>
        </div>

        {!isSupabaseAdminConfigured ? (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
            Ajoute <code>SUPABASE_SERVICE_ROLE_KEY</code> dans <code>.env</code> pour activer
            l&apos;upload et l&apos;insertion depuis le site.
          </div>
        ) : null}

        <form
          action={createArticle}
          className="grid gap-5 rounded-[2rem] border border-[var(--border)] bg-white p-6 shadow-[0_20px_60px_-42px_rgba(15,23,42,0.28)]"
        >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Titre" name="title" type="text" required />
              <Field
                label="Auteur"
                name="author"
                as="select"
                required
                options={["Baptiste", "Clément"]}
              />
            <Field label="Date de publication" name="published_date" type="datetime-local" required />
            <Field
              label="URL image de couverture"
              name="cover_image_url"
              type="url"
              required
            />
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--text-strong)]">Résumé</span>
            <textarea
              name="summary"
              rows={5}
              required
              maxLength={400}
              placeholder="Résumé éditorial de l'article"
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm outline-none placeholder:text-[var(--text-muted)]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--text-strong)]">
              Mots-clés
            </span>
            <input
              name="keywords"
              type="text"
              placeholder="mot-clé 1, mot-clé 2, mot-clé 3"
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm outline-none placeholder:text-[var(--text-muted)]"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-[var(--text-strong)]">Fichier PDF</span>
            <input
              name="pdf_file"
              type="file"
              accept="application/pdf"
              required
              className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[var(--text-strong)] file:px-4 file:py-2 file:text-white"
            />
          </label>

          <button
            type="submit"
            className="inline-flex w-fit rounded-full bg-[var(--text-strong)] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
          >
            Publier l&apos;article
          </button>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  type,
  required,
  as = "input",
  options,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  as?: "input" | "select";
  options?: string[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-medium text-[var(--text-strong)]">{label}</span>
      {as === "select" ? (
        <select
          name={name}
          required={required}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm outline-none"
        >
          {options?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          required={required}
          className="rounded-2xl border border-[var(--border)] bg-[var(--surface-soft)] px-4 py-3 text-sm outline-none"
        />
      )}
    </label>
  );
}
