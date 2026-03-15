/**
 * Renders text with:
 * - \n → <br />
 * - **text** → <strong>text</strong>
 */

function renderInline(text: string, key: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match;
  let idx = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(<span key={`${key}-t${idx++}`}>{text.slice(lastIndex, match.index)}</span>);
    }
    parts.push(<strong key={`${key}-b${idx++}`}>{match[1]}</strong>);
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(<span key={`${key}-t${idx}`}>{text.slice(lastIndex)}</span>);
  }

  return parts.length > 0 ? parts : [<span key={`${key}-plain`}>{text}</span>];
}

export default function TextWithBreaks({ text }: { text: string }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {renderInline(line, String(i))}
          {i < lines.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}
