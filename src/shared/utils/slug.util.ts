/**
 * Genera un slug único a partir de un texto
 * @param text Texto a convertir en slug
 * @returns Slug normalizado
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Reemplazar múltiples guiones con uno solo
    .replace(/^-+|-+$/g, ''); // Eliminar guiones al inicio y final
}

/**
 * Genera un slug único agregando un número si es necesario
 * @param text Texto base
 * @param checkUnique Función para verificar si el slug ya existe
 * @returns Slug único
 */
export async function generateUniqueSlug(
  text: string,
  checkUnique: (slug: string) => Promise<boolean>,
): Promise<string> {
  let baseSlug = generateSlug(text);
  let uniqueSlug = baseSlug;
  let counter = 1;

  while (await checkUnique(uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

