'use client';

import React, { useEffect, useState } from 'react';

interface MatrixDisplayProps {
  title?: string | undefined;
  subtitle?: string | undefined;
  content?: string | undefined;
  isLoading?: boolean;
  isTyping?: boolean;
  disableAnimations?: boolean;
}

/**
 * MatrixDisplay - Matrix-style typing and scrolling effects
 * 
 * Features:
 * - Character-by-character typing animation
 * - Glitch effects during loading
 * - Scanline overlay
 * - Green monospace text
 */
export function MatrixDisplay({
  title,
  subtitle,
  content,
  isLoading = false,
  isTyping = false,
  disableAnimations = false,
}: MatrixDisplayProps) {
  const [displayedTitle, setDisplayedTitle] = useState('');
  const [displayedSubtitle, setDisplayedSubtitle] = useState('');
  const [displayedContent, setDisplayedContent] = useState('');

  // Typing animation for title
  useEffect(() => {
    if (disableAnimations || !isTyping) {
      setDisplayedTitle(title || '');
      return;
    }

    if (!title) {
      setDisplayedTitle('');
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index <= title.length) {
        setDisplayedTitle(title.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [title, isTyping, disableAnimations]);

  // Typing animation for subtitle
  useEffect(() => {
    if (disableAnimations || !isTyping || !displayedTitle) {
      setDisplayedSubtitle(subtitle || '');
      return;
    }

    if (!subtitle) {
      setDisplayedSubtitle('');
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index <= subtitle.length) {
        setDisplayedSubtitle(subtitle.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [subtitle, isTyping, displayedTitle, disableAnimations]);

  // Typing animation for content
  useEffect(() => {
    if (disableAnimations || !isTyping) {
      setDisplayedContent(content || '');
      return;
    }

    if (!content) {
      setDisplayedContent('');
      return;
    }

    let index = 0;
    const interval = setInterval(() => {
      if (index <= content.length) {
        setDisplayedContent(content.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [content, isTyping, disableAnimations]);

  return (
    <div className="font-mono text-green-400 bg-black leading-relaxed tracking-wide whitespace-pre-wrap break-words">
      {title && (
        <div className="text-lg font-bold mb-3 uppercase tracking-wider min-h-[24px]">
          {displayedTitle}
          {isTyping && displayedTitle !== title && <span className="inline-block w-2 h-3.5 bg-green-400 ml-1 animate-pulse" />}
        </div>
      )}

      {subtitle && (
        <div className="text-sm mb-4 opacity-80 min-h-[18px]">
          {displayedSubtitle}
          {isTyping && displayedSubtitle !== subtitle && <span className="inline-block w-2 h-3.5 bg-green-400 ml-1 animate-pulse" />}
        </div>
      )}

      {content && (
        <div className="text-xs opacity-90 min-h-[20px]">
          {displayedContent}
          {isTyping && displayedContent !== content && <span className="inline-block w-2 h-3.5 bg-green-400 ml-1 animate-pulse" />}
        </div>
      )}

      {isLoading && !content && (
        <div className="text-xs opacity-90 min-h-[20px]">
          <span className="animate-pulse">
            ▓▒░ PROCESSING ░▒▓
          </span>
        </div>
      )}
    </div>  );
}
