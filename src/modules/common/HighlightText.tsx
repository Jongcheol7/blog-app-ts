"use client";

type Props = {
  text: string;
  keyword: string;
};

export default function HighlightText({ text, keyword }: Props) {
  if (!keyword || !keyword.trim()) {
    return <>{text}</>;
  }

  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));

  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-300/40 dark:bg-yellow-500/30 rounded-sm px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}
