import React from 'react';
import './crt-effects.css';

export function CRTScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="crt-effects">
      <div className="crt-effects__scanlines" />
      <div className="crt-effects__glow" />
      {children}
    </div>
  );
}
