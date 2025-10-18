import React from 'react';
import Image from 'next/image';

export interface FooterMessage {
  type: 'error' | 'info' | 'hover' | 'help';
  text: string;
  priority?: number;
}

export interface FooterZoneProps {
  messages?: FooterMessage[];
  disableAnimations?: boolean;
  children?: React.ReactNode;
}

const MESSAGE_PRIORITIES: Record<FooterMessage['type'], number> = {
  error: 100,
  info: 50,
  hover: 30,
  help: 10,
};

const MESSAGE_STYLES: Record<FooterMessage['type'], string> = {
  error: 'border-red-500/40 bg-red-900/70 text-red-100',
  info: 'border-blue-500/40 bg-blue-900/70 text-blue-100',
  hover: 'border-zinc-500/40 bg-zinc-800/70 text-zinc-300',
  help: 'border-emerald-500/40 bg-emerald-900/70 text-emerald-100',
};

const MESSAGE_ICONS: Record<FooterMessage['type'], string> = {
  error: '[!]',
  info: '[i]',
  hover: '->',
  help: '[?]',
};

export function FooterZone({
  messages = [],
  disableAnimations = false,
  children,
}: FooterZoneProps) {
  const sortedMessages = messages
    .map((message) => ({
      ...message,
      priority: message.priority ?? MESSAGE_PRIORITIES[message.type],
    }))
    .sort((a, b) => b.priority! - a.priority!);

  const activeMessage = sortedMessages[0];

  return (
    <div className="footer-zone flex w-full flex-col gap-3">
      {activeMessage ? (
        <div
          className={`footer-zone__message flex justify-end ${
            disableAnimations ? '' : 'animate-in fade-in duration-200'
          }`}
          role="status"
          aria-live="polite"
        >
          <div
            className={`inline-flex max-w-md items-center gap-2 rounded-lg border px-3 py-2 text-[0.7rem] font-semibold uppercase tracking-[0.25em] shadow-lg ${
              MESSAGE_STYLES[activeMessage.type]
            }`}
          >
            <span aria-hidden="true">{MESSAGE_ICONS[activeMessage.type]}</span>
            <span>{activeMessage.text}</span>
          </div>
        </div>
      ) : null}

      {children ? (
        <div className="footer-zone__actions flex w-full items-center justify-between">
          <Image src="/components/imgs/devoteLogo.jpeg" alt="DeVOTE Logo" width={40} height={40} className="h-10 w-auto" />
          {children}
        </div>
      ) : null}
    </div>
  );
}

export function createFooterMessage(
  type: FooterMessage['type'],
  text: string,
  priority?: number
): FooterMessage {
  return {
    type,
    text,
    priority: priority ?? MESSAGE_PRIORITIES[type],
  };
}
