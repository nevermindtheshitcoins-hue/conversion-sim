import React from 'react';

export type FooterMessageType = 'error' | 'warning' | 'info' | 'hover' | 'help';

export interface FooterMessage {
  type: FooterMessageType;
  text: string;
  priority: number; // Higher = more important
}

export interface FooterZoneProps {
  messages: FooterMessage[];
  disableAnimations?: boolean;
}

export function FooterZone({
  messages,
  disableAnimations = false,
}: FooterZoneProps) {
  // Sort by priority and take the highest
  const sortedMessages = [...messages].sort((a, b) => b.priority - a.priority);

  const typeStyles: Record<FooterMessageType, string> = {
    error:
      'border-red-500/40 bg-red-900/70 text-red-100 shadow-[0_0_18px_rgba(239,68,68,0.2)]',
    warning:
      'border-yellow-500/40 bg-yellow-900/70 text-yellow-100 shadow-[0_0_18px_rgba(245,158,11,0.2)]',
    info:
      'border-blue-500/40 bg-blue-900/70 text-blue-100 shadow-[0_0_18px_rgba(59,130,246,0.2)]',
    hover:
      'border-zinc-500/40 bg-zinc-800/70 text-zinc-300 shadow-[0_0_18px_rgba(113,113,122,0.2)]',
    help:
      'border-emerald-500/40 bg-emerald-900/70 text-emerald-100 shadow-[0_0_18px_rgba(16,185,129,0.2)]',
  };

  const typeIcons: Record<FooterMessageType, string> = {
    error: '⚠',
    warning: '!',
    info: 'ℹ',
    hover: '→',
    help: '?',
  };

  const fallbackMessage = createFooterMessage('help', 'System ready. Awaiting input.', 0);
  const messagesToRender = sortedMessages.length > 0 ? sortedMessages : [fallbackMessage];
  const activeMessage = messagesToRender[0];

  if (!activeMessage) {
    return null;
  }

  return (
    <div
      className={`flex justify-end p-2 ${disableAnimations ? '' : 'animate-in fade-in duration-200'}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`inline-flex max-w-md items-center gap-2 rounded-lg border px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] shadow-lg backdrop-blur-sm ${
          typeStyles[activeMessage.type]
        } ${disableAnimations ? '' : 'animate-in slide-in-from-bottom-2 duration-300'}`}
      >
        <span aria-hidden="true" className="text-base">{typeIcons[activeMessage.type]}</span>
        <span className="font-mono">{activeMessage.text}</span>
      </div>
    </div>
  );
}

// Helper to create messages with proper priority
export function createFooterMessage(
  type: FooterMessageType,
  text: string,
  priority?: number
): FooterMessage {
  const defaultPriorities = {
    error: 100,
    warning: 80,
    info: 50,
    hover: 30,
    help: 10,
  };

  return {
    type,
    text,
    priority: priority ?? defaultPriorities[type],
  };
}
