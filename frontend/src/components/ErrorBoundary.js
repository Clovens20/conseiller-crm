import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Ignore removeChild errors - they don't affect functionality
    if (error.message && error.message.includes('removeChild')) {
      console.warn('Caught removeChild error (React 19 compatibility issue):', error);
      return { hasError: false };
    }
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error but don't crash for removeChild issues
    if (error.message && error.message.includes('removeChild')) {
      console.warn('React 19 DOM reconciliation warning:', error);
      return;
    }
    console.error('Application error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="text-center max-w-md">
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Une erreur est survenue
            </h2>
            <p className="text-slate-600 mb-4">
              Veuillez rafraîchir la page pour continuer.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
            >
              Rafraîchir la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
