/**
 * Lightweight fuzzy search — zero dependencies.
 *
 * Strategy: a direct substring match scores perfectly; otherwise we compare the
 * query word-by-word against the target's words using a normalized Levenshtein
 * distance, so minor typos ("marketng" → "marketing") still match.
 */

/** Levenshtein (edit) distance between two strings. */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  // Single-row rolling array for O(n) memory.
  const row: number[] = Array.from({ length: n + 1 }, (_, i) => i);

  for (let i = 1; i <= m; i++) {
    let prevDiagonal = row[0]!;
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const above = row[j]!;
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(
        row[j]! + 1, // deletion
        row[j - 1]! + 1, // insertion
        prevDiagonal + cost, // substitution
      );
      prevDiagonal = above;
    }
  }

  return row[n]!;
}

/** Similarity of a single query word against a single target word (0–1). */
function wordSimilarity(query: string, word: string): number {
  if (word === query) return 1;
  if (word.includes(query)) return 0.92;
  const maxLen = Math.max(query.length, word.length);
  if (maxLen === 0) return 0;
  return 1 - levenshtein(query, word) / maxLen;
}

/**
 * Score a free-text query against a target string (0–1, higher is better).
 * Each query word contributes its best match among the target's words.
 */
export function fuzzyScore(query: string, text: string): number {
  const q = query.trim().toLowerCase();
  if (q.length === 0) return 1;

  const t = text.toLowerCase();
  if (t.includes(q)) return 1;

  const queryWords = q.split(/\s+/).filter(Boolean);
  const textWords = t.split(/\s+/).filter(Boolean);
  if (queryWords.length === 0 || textWords.length === 0) return 0;

  const total = queryWords.reduce((sum, qw) => {
    const best = textWords.reduce((max, tw) => Math.max(max, wordSimilarity(qw, tw)), 0);
    return sum + best;
  }, 0);

  return total / queryWords.length;
}

/**
 * Filter + rank a list by fuzzy relevance to `query`. Returns the original list
 * (unsorted) when the query is empty.
 *
 * @param threshold Minimum average word similarity to keep an item (0–1).
 */
export function fuzzyFilter<T>(
  items: readonly T[],
  query: string,
  getText: (item: T) => string,
  threshold = 0.5,
): T[] {
  if (query.trim().length === 0) return [...items];

  return items
    .map((item) => ({ item, score: fuzzyScore(query, getText(item)) }))
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}
