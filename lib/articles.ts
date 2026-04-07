import type { Article } from "@/lib/types";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { resolvePdfUrl } from "@/lib/storage";

function normalizeArticle(article: Partial<Article>): Article {
  return {
    id: String(article.id ?? ""),
    title: String(article.title ?? ""),
    summary: String(article.summary ?? ""),
    author: String(article.author ?? ""),
    published_date: String(article.published_date ?? new Date().toISOString()),
    cover_image_url: String(article.cover_image_url ?? ""),
    pdf_url: resolvePdfUrl(String(article.pdf_url ?? "")),
    keywords: Array.isArray(article.keywords) ? article.keywords.filter(Boolean) : [],
    created_at: String(article.created_at ?? new Date().toISOString()),
    content: article.content ? String(article.content) : undefined,
  };
}

export async function getArticles(): Promise<Article[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("published_date", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as Partial<Article>[]).map(normalizeArticle);
}

export async function getArticleById(id: string): Promise<Article | null> {
  const normalizedId = String(id ?? "").trim();
  if (!normalizedId || !isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", normalizedId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return normalizeArticle(data as Partial<Article>);
}

export async function getArticleByIdOrSlug(id: string): Promise<Article | null> {
  const normalizedId = String(id ?? "").trim().toLowerCase();
  if (!normalizedId) return null;

  const article = await getArticleById(normalizedId);
  if (article) return article;

  const articles = await getArticles();
  return (
    articles.find((item) => {
      const title = String(item.title ?? "").toLowerCase();
      const itemId = String(item.id ?? "").toLowerCase();
      return title.includes(normalizedId) || itemId.includes(normalizedId);
    }) ?? null
  );
}
