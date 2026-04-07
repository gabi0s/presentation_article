"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { PDF_BUCKET } from "@/lib/storage";

export async function createArticle(formData: FormData): Promise<void> {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const publishedDate = String(formData.get("published_date") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const keywordsRaw = String(formData.get("keywords") ?? "").trim();
  const pdfFile = formData.get("pdf_file");

  if (!supabaseAdmin) {
    throw new Error(
      "La variable SUPABASE_SERVICE_ROLE_KEY est manquante pour l'administration."
    );
  }

  if (!title || !summary || !author || !publishedDate) {
    throw new Error("Les champs titre, resume, auteur et date sont obligatoires.");
  }

  if (!(pdfFile instanceof File) || pdfFile.size === 0) {
    throw new Error("Merci de choisir un fichier PDF.");
  }

  const fileName = `${crypto.randomUUID()}-${pdfFile.name}`.replaceAll(" ", "-");
  const uploadBuffer = Buffer.from(await pdfFile.arrayBuffer());

  const uploadResult = await supabaseAdmin.storage
    .from(PDF_BUCKET)
    .upload(fileName, uploadBuffer, {
      contentType: pdfFile.type || "application/pdf",
      upsert: false,
    });

  if (uploadResult.error) {
    throw new Error(uploadResult.error.message);
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(PDF_BUCKET)
    .getPublicUrl(fileName);

  const keywords = keywordsRaw
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const insertResult = await supabaseAdmin.from("articles").insert({
    title,
    summary,
    author,
    published_date: new Date(publishedDate).toISOString(),
    cover_image_url: coverImageUrl,
    pdf_url: publicUrlData.publicUrl,
    keywords,
  });

  if (insertResult.error) {
    throw new Error(insertResult.error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}
