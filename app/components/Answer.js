"use client"; // ✅ Required in Next.js for client-side hooks/components

import { useEffect, useState } from "react";
import { checkHeading, replaceHeadingStarts } from "./helper";

import SyntaxHighlighter from "react-syntax-highlighter/dist/cjs/light";
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';

const Answer = ({ ans, totalResult, index, type }) => {
  const [heading, setHeading] = useState(false);
  const [answer, setAnswer] = useState(ans);

  useEffect(() => {
    if (checkHeading(ans)) {
      setHeading(true);
      setAnswer(replaceHeadingStarts(ans));
    }
  }, [ans]);

  const renderer = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          {...props}
          language={match[1]}
          style={dark}
          PreTag="div"
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code {...props} className={className}>
          {children}
        </code>
      );
    },
  };

  return (
    <>
      {index === 0 && totalResult > 1 ? (
        <span className="pt-2 text-xl  text-white">{answer}</span>
      ) : heading ? (
        <span className="pt-2 text-lg  text-white">{answer}</span>
      ) : (
        <span className={type === 'q' ? 'pl-1' : 'pl-5'}>
          <ReactMarkdown components={renderer}>{answer}</ReactMarkdown>
        </span>
      )}
    </>
  );
};

export default Answer;
