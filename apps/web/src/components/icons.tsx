import type { ReactNode } from "react";

type IconProps = {
  className?: string;
};

export function BrandMark({ className }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 40 40"
      width="40"
      height="40"
    >
      <rect width="40" height="40" rx="10" fill="currentColor" />
      <path d="M11 11h12a7 7 0 0 1 7 7v11H18a7 7 0 0 1-7-7V11Z" fill="white" />
      <path d="M18 16h8M18 20h8M18 24h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="29" r="5" fill="#c2410c" />
      <path d="m10 29 1.5 1.5 3-3.5" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LineIcon({ children }: { children: ReactNode }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
      {children}
    </svg>
  );
}

export function SourceIcon() {
  return (
    <LineIcon>
      <path d="M7 3h7l4 4v14H7z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M14 3v5h5M10 12h5M10 16h5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </LineIcon>
  );
}

export function ShieldIcon() {
  return (
    <LineIcon>
      <path d="M12 3 20 6v5c0 5-3.2 8.3-8 10-4.8-1.7-8-5-8-10V6z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m8.5 12 2.2 2.2 4.8-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </LineIcon>
  );
}

export function NetworkIcon() {
  return (
    <LineIcon>
      <circle cx="12" cy="5" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="5" cy="18" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="19" cy="18" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="m11 7-4.5 8M13 7l4.5 8M8 18h8" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </LineIcon>
  );
}
