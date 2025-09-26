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
    console.error('Error caught by boundary:', error, errorInfo);
    window.parent?.postMessage(
      {
        type: 'ERROR_OCCURRED',
        error: error.message,
        stack: error.stack,
      },
      '*'
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
      <h1 className="text-2xl font-bold text-red-400 mb-4">Something went wrong</h1>
      <p className="text-sm text-slate-300 mb-6">{error.message}</p>
      <button
        onClick={resetError}
        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export default ErrorBoundary;