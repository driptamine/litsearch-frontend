/// <reference types="vite/client" />

declare module 'uniqid' {
  const uniqid: () => string;
  export default uniqid;
}

// Lightweight HLS build without bundled type declarations.
declare module 'hls.js/dist/hls.light.min.js' {
  const Hls: any;
  export default Hls;
}

// Only the API surface used by LatexRenderer.
declare module 'katex' {
  export function renderToString(
    math: string,
    options?: { throwOnError?: boolean; displayMode?: boolean; output?: string }
  ): string;
  const katex: { renderToString: typeof renderToString };
  export default katex;
}

// Untyped fullscreen wrapper used by MediaGalleryModal.
declare module 'react-full-screen' {
  import type { ReactNode, ComponentType } from 'react';
  export const FullScreen: ComponentType<{
    enabled?: boolean;
    onChange?: (isFull: boolean, handle?: unknown) => void;
    children?: ReactNode;
  }>;
}
