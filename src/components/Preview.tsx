'use client';

import { forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface PreviewProps {
  markdown: string;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(
  ({ markdown: markdownContent }, ref) => {
    return (
      <div className="preview-content" ref={ref}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>
    );
  }
);

Preview.displayName = 'Preview';

export default Preview;
