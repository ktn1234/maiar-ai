// Utility to parse a chat message into text and media segments with proper typing
// ---------------------------------------------------------------------------------

export type MessageSegment =
  | { kind: "text"; text: string }
  | { kind: "image" | "video" | "audio"; src: string };

// RegExp that matches absolute URLs or relative paths pointing to supported media.
// We purposely keep the query string in the match so the link remains functional.
const MEDIA_TOKEN_RE =
  /(https?:\/\/\S+|(?:\.\.\/|\.\/|\/)?\S+\.(?:png|jpe?g|gif|webp|svg|mp4|webm|mov|avi|mkv|mp3|wav|ogg|m4a)(?:\?\S+)?)/gi;

/**
 * Strip query-string and hash to expose the base path for extension checking.
 */
function stripQuery(src: string): string {
  return src.split(/[?#]/)[0];
}

function detectKind(src: string): "image" | "video" | "audio" | null {
  const clean = stripQuery(src).toLowerCase();
  if (clean.match(/\.(png|jpe?g|gif|webp|svg)$/)) return "image";
  if (clean.match(/\.(mp4|webm|mov|avi|mkv)$/)) return "video";
  if (clean.match(/\.(mp3|wav|ogg|m4a)$/)) return "audio";
  return null;
}

function normaliseSrc(src: string, staticBaseUrl: string): string {
  // Remote URL? leave untouched
  if (/^(https?:)?\/\//i.test(src)) return src;
  // root-relative path
  if (src.startsWith("/")) return `${staticBaseUrl}${src}`;
  // otherwise treat as relative to the static base
  return `${staticBaseUrl}/${src.replace(/^\.\//, "")}`;
}

/**
 * Parse a raw chat message into a sequence of segments. Text segments preserve
 * original newlines, media segments carry the src ready for rendering.
 *
 * @param raw            The raw message string.
 * @param staticBaseUrl  Optional base URL to prepend to local paths.
 */
export function parseMessage(
  raw: string,
  staticBaseUrl = ""
): MessageSegment[] {
  if (!raw) return [{ kind: "text", text: "" }];

  const segments: MessageSegment[] = [];
  let lastIndex = 0;

  for (const match of raw.matchAll(MEDIA_TOKEN_RE)) {
    const matchText = match[0];
    const index = match.index ?? 0;

    // Push preceding text if any
    if (index > lastIndex) {
      segments.push({ kind: "text", text: raw.slice(lastIndex, index) });
    }

    const kind = detectKind(matchText);
    if (kind) {
      const src = normaliseSrc(matchText, staticBaseUrl);
      segments.push({ kind, src });
    } else {
      // Fallback to plain text if detection failed
      segments.push({ kind: "text", text: matchText });
    }

    lastIndex = index + matchText.length;
  }

  // Trailing text after the last match
  if (lastIndex < raw.length) {
    segments.push({ kind: "text", text: raw.slice(lastIndex) });
  }

  return segments;
}
