"use client";

import DOMPurify from "dompurify";

interface RichTextRendererProps {
  content: string;
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  const clean = DOMPurify.sanitize(content);
  return (
    <div
      className="rich-content prose max-w-none"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
}
