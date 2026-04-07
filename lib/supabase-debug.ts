import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export type SupabaseDebugInfo = {
  configured: boolean;
  urlPresent: boolean;
  publishableKeyPresent: boolean;
  rowCount: number | null;
  sample: Record<string, unknown> | null;
  error: string | null;
};

export async function getSupabaseDebugInfo(): Promise<SupabaseDebugInfo> {
  const urlPresent = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKeyPresent = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!isSupabaseConfigured || !supabase) {
    return {
      configured: false,
      urlPresent,
      publishableKeyPresent,
      rowCount: null,
      sample: null,
      error: "Supabase n'est pas configuré dans l'environnement.",
    };
  }

  const { count, data, error } = await supabase
    .from("articles")
    .select("*", { count: "exact" })
    .limit(1);

  return {
    configured: true,
    urlPresent,
    publishableKeyPresent,
    rowCount: typeof count === "number" ? count : null,
    sample: data && data.length > 0 ? (data[0] as Record<string, unknown>) : null,
    error: error ? error.message : null,
  };
}
