/*
 * A reusable error boundary component.  This component catches errors
 * thrown by its children in the React component tree and displays a
 * fallback UI.  It also posts a message to the parent frame via
 * window.postMessage when an error occurs, enabling iframe owners to
 * record or respond to runtime failures.
 */

'use client';

import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const sanitizedMessage = error.message?.replace(/[\r\n\t]/g, '').substring(0, 200) || 'Unknown error';
    const sanitizedStack = error.stack?.replace(/[\r\n\t]/g, ' ').substring(0, 500) || '';
    const sanitizedComponentStack = errorInfo.componentStack?.replace(/[\r\n\t]/g, ' ').substring(0, 300) || '';
    
    console.error('Error caught by boundary:', sanitizedMessage, { componentStack: sanitizedComponentStack });
    // Only send error messages to trusted origins
    let targetOrigin: string;
    try {
      const parentOrigin = window.parent?.location?.origin;
      const allowedOrigins = [window.location.origin, 'https://yourdomain.com'];
      targetOrigin = allowedOrigins.includes(parentOrigin || '') 
        ? (parentOrigin || window.location.origin) 
        : window.location.origin;
    } catch (securityError) {
      // Handle cross-origin iframe SecurityError
      targetOrigin = window.location.origin;
    }
      
    window.parent?.postMessage(
      {
        type: 'ERROR_OCCURRED',
        error: sanitizedMessage,
        stack: sanitizedStack.substring(0, 200),
      },
      targetOrigin
    );
  }
  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback;
      return (
        <FallbackComponent
          error={this.state.error!}
          resetError={() => this.setState({ hasError: false, error: undefined })}
        />
      );
    }
    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{
  error: Error;
  resetError: () => void;
}> = ({ error, resetError }) => (
  <div className="min-h-screen bg-[#0a0f12] text-slate-100 flex items-center justify-center p-6">
    <div className="text-center max-w-md">
      <h1 className="text-2xl font-bold text-red-400 mb-4">System check failed</h1>
      <p className="text-sm text-slate-300 mb-6">Refresh and try again.</p>
      <button
        onClick={resetError}
        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
      >
Refresh
      </button>
    </div>
  </div>
);

export default ErrorBoundary;