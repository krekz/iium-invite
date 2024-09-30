import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import React from "react";

interface MarkdownProps {
    children: string | React.ReactNode;
}

export default function Markdown({ children }: MarkdownProps) {
    const content = typeof children === "string" ? children : "";

    return (
        <ReactMarkdown
            className={`space-y-3 prose prose-sm max-w-none prose-invert nested-ordered-list `}
            components={{
                ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2" {...props} />,
                ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2" {...props} />,
                li: ({ node, ...props }) => <li className="pl-1 marker:text-white" {...props} />,
                hr: ({ node, ...props }) => <hr className="border-white" {...props} />,
            }}
            remarkPlugins={[remarkBreaks]}
            rehypePlugins={[rehypeRaw]}
        >
            {content}
        </ReactMarkdown>
    );
}