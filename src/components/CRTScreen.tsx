import React from 'react';
import './crt-effects.css';

export function CRTScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="crt-screen">
      <div className="scanlines"/>
      <div className="glow"/>
      {children}
    </div>
  );
}
