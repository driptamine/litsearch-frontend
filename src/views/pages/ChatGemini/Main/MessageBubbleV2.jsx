import React from "react";
import styled from "styled-components";
import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // You can change theme

// Custom tokenizer for ==highlight==
const tokenizer = {
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
};

// Custom renderer to enable syntax highlighting with span tags
const renderer = new marked.Renderer();

renderer.code = (code, language) => {
  const validLang = !!(language && hljs.getLanguage(language));
  const highlighted = validLang
    ? hljs.highlight(code, { language }).value
    : hljs.highlightAuto(code).value;

  const langClass = validLang ? `language-${language}` : '';
  return `<pre><code class="${langClass}">${highlighted}</code></pre>`;
};

// Configure marked with custom renderer and tokenizer
marked.use({
  extensions: [tokenizer],
  renderer,
  gfm: true,
  breaks: true,
});

const MessageBubbleV2 = ({ content, from }) => {
  const rawHtml = marked(content); // Ensure code blocks use fenced syntax in `content`
  const cleanHtml = DOMPurify.sanitize(rawHtml);

  return <Bubble from={from} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
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
    background: #0f172a;
    padding: 12px;
    border-radius: 8px;
    overflow-x: auto;
  }

  code {
    font-family: "Fira Code", monospace;
    font-size: 0.95rem;
    color: white;
  }

  .highlight {
    background-color: yellow;
    padding: 0 4px;
    border-radius: 3px;
  }
`;

export default MessageBubbleV2;
