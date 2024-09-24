import { eq } from 'drizzle-orm'
import { db } from '..'
import { events } from '../schema'

// export function generateSlug(title: string): string {
//   return title
//     .toLowerCase()
//     .trim()
//     .replace(/[^\w\s-]/g, '')
//     .replace(/\s+/g, '-')
// }

export function generateSlug(title: string): string {
  // Remove acentos e outros diacríticos
  const normalized = title.normalize('NFD').replace(/[\p{Diacritic}]/gu, '')

  return normalized
    .toLowerCase() // Converte para letras minúsculas
    .replace(/[^\w\s-]/g, '') // Remove caracteres especiais, exceto espaços e hifens
    .replace(/\s+/g, '-') // Substitui espaços por hifens
    .trim() // Remove espaços extras no início e no final
}

// export async function generateUniqueSlug(slug: string): Promise<string> {
//   let uniqueSlug = slug
//   let counter = 1

//   // Verifica se o slug já existe no banco de dados
//   const existingEvent = await db
//     .select()
//     .from(events)
//     .where(eq(events.slug, slug))
//     .limit(1)

//   // Se o slug já existe, entra no loop para incrementar o slug
//   while (existingEvent.length > 0) {
//     uniqueSlug = `${slug}-${counter}`

//     // Refaz a consulta para verificar se o novo slug já existe
//     const slugCheck = await db
//       .select()
//       .from(events)
//       .where(eq(events.slug, uniqueSlug))
//       .limit(1)

//     if (slugCheck.length === 0) {
//       // Se o novo slug é único, sai do loop
//       break
//     }

//     // Incrementa o contador para tentar um novo slug
//     counter++
//   }

//   return uniqueSlug
// }
