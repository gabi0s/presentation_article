import os
import uuid
from datetime import datetime, timezone
from pathlib import Path

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
BUCKET_NAME = "articles_pdf"
PDF_FOLDER = r"C:\Users\gabri\Desktop\pdf"


def init_supabase() -> Client:
    """Initialise le client Supabase.

    La clé service role est nécessaire pour insérer dans la table si RLS bloque l'anon.
    """
    if not SUPABASE_URL:
        raise ValueError("Variable NEXT_PUBLIC_SUPABASE_URL manquante dans .env")

    if SUPABASE_SERVICE_ROLE_KEY:
        print("✅ Clé utilisée : service role")
        return create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    if SUPABASE_ANON_KEY:
        print("✅ Clé utilisée : anon")
        return create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

    raise ValueError("Aucune clé Supabase trouvée dans .env")


def get_pdf_files(folder: str) -> list[Path]:
    pdf_files: list[Path] = []
    folder_path = Path(folder)

    if not folder_path.exists():
        raise FileNotFoundError(f"Dossier introuvable : {folder}")

    for file in folder_path.iterdir():
        if file.is_file() and file.suffix.lower() == ".pdf":
            pdf_files.append(file)

    print(f"📁 {len(pdf_files)} fichier(s) PDF trouvé(s)")
    return pdf_files


def upload_pdf(supabase: Client, file_path: Path) -> tuple[str, str]:
    """Upload un PDF vers le bucket public et retourne (storage_path, public_url)."""
    unique_id = str(uuid.uuid4())[:8]
    storage_path = f"articles/{unique_id}_{file_path.name}"

    with open(file_path, "rb") as f:
        file_content = f.read()

    result = supabase.storage.from_(BUCKET_NAME).upload(
        path=storage_path,
        file=file_content,
        file_options={"content-type": "application/pdf"},
    )

    if getattr(result, "error", None):
        raise Exception(f"Erreur upload: {result.error}")

    public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(storage_path)
    print(f"   ✅ Upload réussi : {file_path.name}")
    return storage_path, public_url


def extract_metadata_from_filename(filename: str) -> dict:
    name_without_ext = filename.removesuffix(".pdf")

    if " - " in name_without_ext:
        author, title = name_without_ext.split(" - ", 1)
    else:
        author = "Baptiste"
        title = name_without_ext

    author = author.strip()
    title = title.strip()

    return {
        "title": title,
        "author": author,
        "summary": f"Article : {title}",
        "keywords": [keyword for keyword in title.lower().split() if keyword],
    }


def article_exists(supabase: Client, pdf_url: str) -> bool:
    """Vérifie si un article existe déjà dans la base via son URL PDF."""
    result = supabase.table("articles").select("id").eq("pdf_url", pdf_url).execute()
    return len(result.data) > 0


def article_exists_by_title(supabase: Client, title: str) -> bool:
    """Vérifie si un article existe déjà avec le même titre."""
    result = supabase.table("articles").select("id").eq("title", title).execute()
    return len(result.data) > 0


def save_article_to_db(supabase: Client, metadata: dict, pdf_url: str) -> dict:
    """Sauvegarde les métadonnées dans la table articles."""
    data = {
        "title": metadata["title"],
        "summary": metadata.get("summary", ""),
        "author": metadata["author"],
        "pdf_url": pdf_url,
        "keywords": metadata.get("keywords", []),
        "published_date": datetime.now(timezone.utc).isoformat(),
    }

    result = supabase.table("articles").insert(data).execute()

    if getattr(result, "error", None):
        raise Exception(f"Erreur insertion: {result.error}")

    return result.data[0] if result.data else None


def main():
    print("🚀 Début du traitement des PDF...")
    print("=" * 50)

    supabase = init_supabase()
    print(f"✅ Connecté à Supabase : {SUPABASE_URL}")
    print(f"✅ URL présente : {bool(SUPABASE_URL)}")
    print(f"✅ ANON key présente : {bool(SUPABASE_ANON_KEY)}")
    print(f"✅ SERVICE ROLE présente : {bool(SUPABASE_SERVICE_ROLE_KEY)}")

    try:
        supabase.storage.from_(BUCKET_NAME).list()
        print(f"✅ Bucket '{BUCKET_NAME}' accessible")
    except Exception as e:
        print(f"❌ Bucket '{BUCKET_NAME}' inaccessible. Vérifiez qu'il existe et est public.")
        print(f"   Erreur: {e}")
        return

    pdf_files = get_pdf_files(PDF_FOLDER)
    if not pdf_files:
        print("❌ Aucun PDF trouvé dans le dossier.")
        return

    success_count = 0
    skip_count = 0
    error_count = 0

    for i, pdf_file in enumerate(pdf_files, 1):
        print(f"\n📄 [{i}/{len(pdf_files)}] Traitement : {pdf_file.name}")

        try:
            metadata = extract_metadata_from_filename(pdf_file.name)
            print(f"   📝 Titre : {metadata['title']}")
            print(f"   ✍️ Auteur : {metadata['author']}")

            if article_exists_by_title(supabase, metadata["title"]):
                print("   ⏭️ Article déjà existant (même titre), ignoré")
                skip_count += 1
                continue

            _, public_url = upload_pdf(supabase, pdf_file)

            if article_exists(supabase, public_url):
                print("   ⏭️ Article déjà existant, ignoré")
                skip_count += 1
                continue

            article = save_article_to_db(supabase, metadata, public_url)

            if article:
                print(f"   ✅ Article créé avec l'ID : {article['id']}")
                success_count += 1

        except Exception as e:
            print(f"   ❌ Erreur : {str(e)}")
            error_count += 1

    print("\n" + "=" * 50)
    print("📊 RÉSUMÉ DU TRAITEMENT")
    print(f"   ✅ Succès : {success_count}")
    print(f"   ⏭️ Ignorés (déjà existants) : {skip_count}")
    print(f"   ❌ Erreurs : {error_count}")
    print(f"   📁 Total PDF trouvés : {len(pdf_files)}")
    print("=" * 50)


if __name__ == "__main__":
    main()
