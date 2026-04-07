import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bibliotheque numerique | Baptiste et Clement",
  description:
    "Collection editoriale de PDF et d'articles partagee par Baptiste et Clement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full">
      <body className="min-h-full bg-[var(--page-bg)] font-sans text-[var(--text-primary)] antialiased">
        {children}
      </body>
    </html>
  );
}
