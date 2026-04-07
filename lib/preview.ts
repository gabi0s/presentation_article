function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function createDocumentPreviewDataUrl(title: string, author: string) {
  const safeTitle = escapeXml(title || "Article");
  const safeAuthor = escapeXml(author || "Auteur");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f9f5ef"/>
          <stop offset="100%" stop-color="#eef3f8"/>
        </linearGradient>
        <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#1d3557"/>
          <stop offset="100%" stop-color="#4d6b8a"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="900" rx="48" fill="url(#bg)"/>
      <rect x="84" y="76" width="1032" height="748" rx="36" fill="#ffffff" stroke="#ddd6c9" stroke-width="2"/>
      <rect x="132" y="128" width="220" height="36" rx="18" fill="#dbe7f4"/>
      <rect x="132" y="192" width="560" height="26" rx="13" fill="#d9dfeb"/>
      <rect x="132" y="236" width="720" height="26" rx="13" fill="#e7ebf2"/>
      <rect x="132" y="280" width="640" height="26" rx="13" fill="#e7ebf2"/>
      <rect x="132" y="360" width="520" height="22" rx="11" fill="#eef1f5"/>
      <rect x="132" y="402" width="740" height="22" rx="11" fill="#eef1f5"/>
      <rect x="132" y="444" width="680" height="22" rx="11" fill="#eef1f5"/>
      <rect x="132" y="534" width="280" height="56" rx="28" fill="url(#accent)"/>
      <text x="170" y="572" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="700" fill="#ffffff">PDF</text>
      <text x="132" y="686" font-family="Cormorant Garamond, Georgia, serif" font-size="54" font-weight="700" fill="#0f172a">${safeTitle}</text>
      <text x="132" y="742" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="500" fill="#667085">${safeAuthor}</text>
      <circle cx="980" cy="190" r="108" fill="#dbe7f4"/>
      <circle cx="980" cy="190" r="66" fill="#1d3557" opacity="0.12"/>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
