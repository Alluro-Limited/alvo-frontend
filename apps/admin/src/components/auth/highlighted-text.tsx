interface HighlightedTextProps {
  /** The full, already-translated sentence. */
  text: string;
  /** The value interpolated into it that should stand out (a name, an email). */
  highlight: string;
  className: string;
}

/** Styles one value inside a translated sentence without splitting the sentence into separate messages. */
export function HighlightedText({text, highlight, className}: HighlightedTextProps) {
  const [before, ...after] = text.split(highlight);
  return (
    <>
      {before}
      <span className={className}>{highlight}</span>
      {after.join(highlight)}
    </>
  );
}
