export type Article = {
  id: string;
  title: string;
  summary: string;
  author: "Baptiste" | "Clément" | string;
  published_date: string;
  cover_image_url: string;
  pdf_url: string;
  keywords: string[];
  created_at: string;
  content?: string;
};
