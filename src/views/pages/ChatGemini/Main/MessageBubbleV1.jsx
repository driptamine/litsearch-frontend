import React from "react";
import styled from "styled-components";
import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"; // Highlight.js theme

// Add custom tokenizer and renderer for ==highlight==


// Custom tokenizer for ==highlight==
const tokenizer = {
  name: "highlight",
  level: "inline", // works inside text
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

// Configure marked
marked.use({
  extensions: [tokenizer],
  highlight: function (code, lang) {
    return lang && hljs.getLanguage(lang)
      ? hljs.highlight(code, { language: lang }).value
      : hljs.highlightAuto(code).value;
  },
  gfm: true,
  breaks: true,
});

const MessageBubbleV1 = ({ content, from }) => {


  // const html = hljs.highlightAuto(content).value;

  const renderer = new marked.Renderer();

  // Highlight code blocks
  // marked.setOptions({
  //   renderer,
  //   highlight: function (code, lang) {
  //     return lang && hljs.getLanguage(lang)
  //       ? hljs.highlight(code, { language: lang }).value
  //       : hljs.highlightAuto(code).value;
  //   },
  //   breaks: true,
  //   gfm: true,
  // });

  const rawHtml = marked(content);
  const cleanHtml = DOMPurify.sanitize(rawHtml);

  return <Bubble from={from} dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};

const Bubble = styled.div`
  background-color: ${(props) => props.from === "user" ? "#e0f2fe" : "#f1f5f9"};
  align-self: ${(props) => props.from === "user" ? "flex-end" : "flex-start"};
  margin: 8px 0;

  margin-left: ${(props) => props.from === 'user' ? "18em": '0px'};
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
