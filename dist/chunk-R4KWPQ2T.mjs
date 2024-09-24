// src/db/functions/create-slug.ts
function generateSlug(title) {
  const normalized = title.normalize("NFD").replace(/[\p{Diacritic}]/gu, "");
  return normalized.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").trim();
}

export {
  generateSlug
};
