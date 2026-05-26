import type { ReactNode } from 'react';

export function Screen({
  title,
  count,
  leading,
  search,
  onSearchChange,
  actions,
  children,
}: {
  title: string;
  count?: string;
  leading?: ReactNode;
  search?: string;
  onSearchChange?: (value: string) => void;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="screen">
      <header className="topbar">
        {leading}
        <h1>{title}</h1>
        {count && <span>{count}</span>}
        <div className="topbarSpacer" />
        {onSearchChange && (
          <div className="searchBox">
            <input
              className="search"
              value={search || ''}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search…"
              aria-label={`Search ${title}`}
            />
            {search && (
              <button
                className="searchClear"
                type="button"
                aria-label={`Clear search for ${title}`}
                onClick={() => onSearchChange('')}
              >
                ×
              </button>
            )}
          </div>
        )}
        {actions}
      </header>
      <main className="center">{children}</main>
    </div>
  );
}
