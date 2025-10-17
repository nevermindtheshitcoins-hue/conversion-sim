import { memo, useMemo } from 'react';
import { AlertTriangle, Copy, RefreshCw } from 'lucide-react';
import { ScreenPresenterProps } from './types';

export const ErrorDisplayPresenter = memo(function ErrorDisplayPresenter({
  title,
  subtitle,
  error,
  onRetry,
}: ScreenPresenterProps) {
  const errorDetails = useMemo(() => {
    if (!error) return null;
    
    // Try to parse error if it contains structured info
    try {
      // Check if error contains request ID pattern
      const requestIdMatch = error.match(/\[req_[\w_]+\]/);
      const requestId = requestIdMatch ? requestIdMatch[0] : null;
      
      return {
        message: error,
        requestId,
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        message: error,
        requestId: null,
        timestamp: new Date().toISOString(),
      };
    }
  }, [error]);

  const handleCopyError = () => {
    if (errorDetails && error) {
      const errorReport = `
Error Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Timestamp: ${errorDetails.timestamp}
${errorDetails.requestId ? `Request ID: ${errorDetails.requestId}` : ''}
Message: ${errorDetails.message}
Title: ${title}
${subtitle ? `Subtitle: ${subtitle}` : ''}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      `.trim();
      
      navigator.clipboard.writeText(errorReport).catch(() => {
        // Fallback: just copy the error message
        navigator.clipboard.writeText(error).catch(() => {
          console.error('Failed to copy error');
        });
      });
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-industrial-charcoal p-4 border-2 border-industrial-orange">
          <AlertTriangle className="h-12 w-12 text-industrial-orange" aria-hidden="true" />
        </div>
        
        <div className="space-y-3 max-w-md">
          <p className="text-sm uppercase tracking-[0.4em] text-industrial-orange font-display font-black">
            Error Occurred
          </p>
          
          <p className="text-xs uppercase tracking-[0.35em] text-text-secondary">
            {title || 'Something went wrong'}
          </p>
          
          {subtitle && (
            <p className="text-xs text-text-disabled break-words">
              {subtitle}
            </p>
          )}
          
          {error && (
            <div className="mt-4 rounded-lg bg-booth-panel border-2 border-industrial-steel p-3">
              <p className="text-xs text-text-primary break-words text-left font-mono">
                {error}
              </p>
              
              {errorDetails?.requestId && (
                <p className="text-xs text-text-secondary mt-2 text-left">
                  Request ID: <span className="text-text-primary font-mono">{errorDetails.requestId}</span>
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {error && (
          <button
            type="button"
            onClick={handleCopyError}
            className="flex items-center gap-2 rounded-lg border-2 border-industrial-steel bg-booth-panel px-4 py-2 text-xs font-display font-black uppercase tracking-wider text-text-primary transition-colors hover:bg-industrial-steel hover:border-industrial-charcoal"
            aria-label="Copy error details"
          >
            <Copy className="h-3 w-3" />
            Copy Details
          </button>
        )}
        
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 rounded-lg border-2 border-industrial-orange bg-booth-panel px-4 py-2 text-xs font-display font-black uppercase tracking-wider text-text-primary transition-colors hover:bg-industrial-orange hover:text-text-primary"
            aria-label="Retry operation"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        )}
      </div>

      <div className="mt-4 text-xs text-text-disabled max-w-md">
        <p>
          If the problem persists, please try refreshing the page or contact support with your request ID.
        </p>
      </div>
    </div>
  );
});
