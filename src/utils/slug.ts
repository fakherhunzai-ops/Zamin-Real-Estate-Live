/**
 * Turns a heading string into a URL-safe anchor id.
 * Shared by the article body (heading anchors) and the table of contents
 * so both always point at the exact same element.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}