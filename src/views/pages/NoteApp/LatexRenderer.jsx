import React, { useMemo } from "react";
import katex from "katex";

function splitLatex(text) {
  const segments = [];
  let i = 0;

  while (i < text.length) {
    const dollarIndex = text.indexOf('$', i);
    if (dollarIndex === -1) {
      segments.push({ type: 'text', value: text.slice(i) });
      break;
    }

    // Check for display math $$
    if (dollarIndex + 1 < text.length && text[dollarIndex + 1] === '$') {
      const closeIndex = text.indexOf('$$', dollarIndex + 2);
      if (closeIndex !== -1 && closeIndex - dollarIndex > 2) {
        if (dollarIndex > i) {
          segments.push({ type: 'text', value: text.slice(i, dollarIndex) });
        }
        const math = text.slice(dollarIndex + 2, closeIndex).trim();
        if (math) segments.push({ type: 'display', value: math });
        i = closeIndex + 2;
        continue;
      }
    }

    // Inline math $
    const closeIndex = text.indexOf('$', dollarIndex + 1);
    if (closeIndex !== -1 && closeIndex - dollarIndex > 1 && text[closeIndex + 1] !== '$') {
      if (dollarIndex > i) {
        segments.push({ type: 'text', value: text.slice(i, dollarIndex) });
      }
      const math = text.slice(dollarIndex + 1, closeIndex).trim();
      segments.push({ type: 'inline', value: math });
      i = closeIndex + 1;
      continue;
    }

    // No closing $ found – treat as plain text
    segments.push({ type: 'text', value: text.slice(i) });
    break;
  }

  return segments;
}

function renderMath(math, displayMode) {
  try {
    return katex.renderToString(math, {
      throwOnError: false,
      displayMode,
      output: 'html',
    });
  } catch {
    return `<span style="color:red">${math}</span>`;
  }
}

const LatexRenderer = ({ text }) => {
  const segments = useMemo(() => splitLatex(text), [text]);

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return <span key={i}>{seg.value}</span>;
        }
        const html = renderMath(seg.value, seg.type === 'display');
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{ __html: html }}
            style={seg.type === 'display' ? { display: 'block', textAlign: 'center', margin: '8px 0' } : {}}
          />
        );
      })}
    </>
  );
};

export default LatexRenderer;
