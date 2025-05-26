import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { getHighlighter } from "shiki";

const MessageBubble = ({ content, from }) => {
  const [html, setHtml] = useState("");

  useEffect(() => {
    const renderMarkdown = async () => {
      const highlighter = await getHighlighter({
        theme: "github-dark", // or "nord", "monokai", etc.
      });

      marked.setOptions({
        highlight: (code, lang) => {
          try {
            return highlighter.codeToHtml(code, { lang });
          } catch {
            return highlighter.codeToHtml(code, { lang: "plaintext" });
          }
        },
        gfm: true,
        breaks: true,
      });

      // Custom tokenizer for ==highlight==
      marked.use({
        extensions: [
          {
            name: "highlight",
            level: "inline",
            start(src) {
              return src.match(/==/)?.index;
            },
            tokenizer(src) {
              const match = /^==([^=]+)==/.exec(src);
              if (match) {
                return {
                  type: "highlight",
                  raw: match[0],
                  text: match[1],
                  tokens: [],
                };
              }
            },
            renderer(token) {
              return `<span class="highlight">${token.text}</span>`;
            },
          },
        ],
      });

      const rawHtml = marked(content);
      const cleanHtml = DOMPurify.sanitize(rawHtml);
      setHtml(cleanHtml);
    };

    renderMarkdown();
  }, [content]);

  return <Bubble from={from} dangerouslySetInnerHTML={{ __html: html }} />;
};

const Bubble = styled.div`
  background-color: ${(props) =>
    props.from === "user" ? "#e0f2fe" : "#f1f5f9"};
  align-self: ${(props) =>
    props.from === "user" ? "flex-end" : "flex-start"};
  margin: 8px 0;
  padding: 12px;
  border-radius: 12px;
  max-width: 80%;
  white-space: pre-wrap;
  font-family: sans-serif;

  pre {
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
  }

  code {
    font-family: "Fira Code", monospace;
    font-size: 0.95rem;
  }

  .highlight {
    background-color: yellow;
    padding: 0 4px;
    border-radius: 3px;
  }
`;

export default MessageBubble;
