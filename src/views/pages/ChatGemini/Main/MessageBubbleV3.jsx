import React from 'react';
import styled from 'styled-components';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import "highlight.js/styles/atom-one-dark.css"; // Highlight.js theme

// ==highlight== custom tokenizer
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

// Custom renderer for code blocks
const renderer = new marked.Renderer();

renderer.code = (code, language) => {
  const safeCode = typeof code === 'string' ? code : String(code ?? '');

  const validLang = language && hljs.getLanguage(language);
  const highlighted = validLang
    ? hljs.highlight(safeCode, { language }).value
    : hljs.highlightAuto(safeCode).value;

  const langClass = validLang ? `language-${language}` : '';
  return `<pre><code class="hljs ${langClass}">${highlighted}</code></pre>`;
};

// Configure marked
marked.use({
  extensions: [tokenizer],
  renderer,
  gfm: true,
  breaks: true,
});

const MessageBubbleV1 = ({ content, from }) => {
  const safeContent = typeof content === 'string' ? content : JSON.stringify(content, null, 2);
  const rawHtml = marked(safeContent);

  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'b', 'i', 'em', 'strong', 'a',
      'code', 'pre', 'span', 'p', 'ul', 'ol', 'li', 'blockquote'
    ],
    ALLOWED_ATTR: ['class', 'href', 'name', 'target'],
  });

  return <Bubble from={from} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};


const Bubble = styled.div`
  background-color: ${(props) => props.from === "user" ? "#e0f2fe" : "#f1f5f9"};
  align-self: ${(props) => props.from === "user" ? "flex-end" : "flex-start"};
  margin: 8px 0;
  margin-left: ${(props) => props.from === 'user' ? "18em" : '0px'};
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
  }

  .highlight {
    background-color: yellow;
    padding: 0 4px;
    border-radius: 3px;
  }
`;

export default MessageBubbleV1;
