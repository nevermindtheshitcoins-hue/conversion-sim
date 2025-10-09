import type { ReactNode } from 'react';

export type CRTShellProps = {
  children: ReactNode;
  scanlines?: boolean;
  vignette?: boolean;
  status?: ReactNode;
  disableMotion?: boolean;
};

export default function CRTShell({
  children,
  scanlines = true,
  vignette = true,
  status,
  disableMotion = false,
}: CRTShellProps) {
  return (
    <div className="crt-screen relative">
      <div className="crt-content">{children}</div>
      {status ? (
        <div
          className="crt-status pointer-events-auto absolute right-4 top-4 z-30 max-w-xs text-right text-sm"
          role="status"
          aria-live="polite"
        >
          {status}
        </div>
      ) : null}
      {scanlines && !disableMotion ? (
        <div className="crt-overlay scanlines" aria-hidden="true" />
      ) : null}
      {vignette ? (
        <div
          className="crt-overlay pointer-events-none"
          aria-hidden="true"
          style={{ boxShadow: 'inset 0 0 120px rgba(0, 0, 0, 0.6)' }}
        />
      ) : null}
    </div>
  );
}
