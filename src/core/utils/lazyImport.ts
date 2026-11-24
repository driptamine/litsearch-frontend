import React from 'react';

// Build-time contract of the `lazyImportTogglePlugin` vite plugin, which rewrites
// `lazyImport(() => import('...'))` into `React.lazy(...)` and strips this import.
// This real implementation only runs when the plugin is off (typecheck, IDE,
// tests) and behaves identically.
export function lazyImport<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  return React.lazy(factory);
}
