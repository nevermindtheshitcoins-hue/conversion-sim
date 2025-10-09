import type { ReactNode } from 'react';

export type CRTShellProps = {
  headerZone: ReactNode;
  screenZone: ReactNode;
  keypadZone: ReactNode;
  footerZone: ReactNode;
  scanlines?: boolean;
  vignette?: boolean;
  disableMotion?: boolean;
};

// Analogue machine interface: fixed display screen + fixed keypad controls

export default function CRTShell({
  headerZone,
  screenZone,
  keypadZone,
  footerZone,
  scanlines = true,
  vignette = true,
  disableMotion = false,
}: CRTShellProps) {
  return (
    <div className="crt-container relative flex flex-col h-screen">
      <div className="header-zone h-16">{headerZone}</div>
      
      <div className="content-area flex-1 flex flex-row gap-4">
        <div className="screen-zone flex-1">{screenZone}</div>
        <div className="keypad-zone w-1/4">{keypadZone}</div>
      </div>
      
      <div className="footer-zone h-16">{footerZone}</div>
      
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
