import { supabase } from "@/lib/supabase";

const PDF_BUCKET = "articles_pdf";

export function resolvePdfUrl(pdfUrl: string) {
  if (!pdfUrl) return "";
  if (/^https?:\/\//i.test(pdfUrl) || pdfUrl.startsWith("blob:")) {
    return pdfUrl;
  }
  if (!supabase) return pdfUrl;
  return supabase.storage.from(PDF_BUCKET).getPublicUrl(pdfUrl).data.publicUrl;
}

export { PDF_BUCKET };
