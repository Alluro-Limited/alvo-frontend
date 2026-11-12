interface RawPage<T> {
  items: T[];
  nextPageToken?: string;
  total: number;
}

type PageFetch<T, R extends object> = (pageToken: string) => Promise<RawPage<T> & R>;

const cursors = new Map<string, Map<number, string>>();

/**
 * The API paginates with opaque `page_token`s while the UI asks for page numbers.
 * Tokens collected along the way are cached per filter signature (`key`), so the
 * numbered pager can go back freely; an unvisited later page is reached by
 * walking forward from the last known one.
 */
export async function fetchPage<T, R extends object = object>(key: string, page: number, fetch: PageFetch<T, R>): Promise<RawPage<T> & R> {
  let tokens = cursors.get(key);
  if (!tokens) cursors.set(key, (tokens = new Map()));
  let from = 1;
  for (let p = page - 1; p > 1; p -= 1) {
    if (tokens.has(p)) {
      from = p;
      break;
    }
  }
  let result: (RawPage<T> & R) | undefined;
  for (let p = from; p <= page; p += 1) {
    result = await fetch(tokens.get(p) ?? "");
    if (result.nextPageToken) tokens.set(p + 1, result.nextPageToken);
  }
  if (!result) throw new Error(`page ${page} was not fetched`);
  return result;
}
