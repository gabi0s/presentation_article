import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase";
import { PDF_BUCKET } from "@/lib/storage";

export type CreateArticleState = {
  status: "idle" | "success" | "error";
  message: string;
};

export async function createArticle(
  _prevState: CreateArticleState,
  formData: FormData
): Promise<CreateArticleState> {
  const title = String(formData.get("title") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const publishedDate = String(formData.get("published_date") ?? "").trim();
  const coverImageUrl = String(formData.get("cover_image_url") ?? "").trim();
  const keywordsRaw = String(formData.get("keywords") ?? "").trim();
  const pdfFile = formData.get("pdf_file");

  if (!supabaseAdmin) {
    return {
      status: "error",
      message:
        "La clé SUPABASE_SERVICE_ROLE_KEY manque dans l'environnement. Ajoute-la pour activer l'administration.",
    };
  }

  if (!title || !summary || !author || !publishedDate || !coverImageUrl) {
    return {
      status: "error",
      message: "Tous les champs sauf les mots-clés sont obligatoires.",
    };
  }

  if (!(pdfFile instanceof File) || pdfFile.size === 0) {
    return {
      status: "error",
      message: "Merci de choisir un fichier PDF.",
    };
  }

  const bucket = PDF_BUCKET;
  const fileName = `${crypto.randomUUID()}-${pdfFile.name}`.replaceAll(" ", "-");
  const uploadBuffer = Buffer.from(await pdfFile.arrayBuffer());

  const uploadResult = await supabaseAdmin.storage
    .from(bucket)
    .upload(fileName, uploadBuffer, {
      contentType: pdfFile.type || "application/pdf",
      upsert: false,
    });

  if (uploadResult.error) {
    return { status: "error", message: uploadResult.error.message };
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(bucket)
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
    return { status: "error", message: insertResult.error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");

  return {
    status: "success",
    message: "Article ajouté avec succès.",
  };
}
