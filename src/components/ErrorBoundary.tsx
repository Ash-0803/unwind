import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="page center-empty"
          style={{ padding: "2rem", textAlign: "center" }}
        >
          <div className="empty-state">
            <div className="empty-icon">?</div>
            <h2>Something went wrong</h2>
            <p>We encountered an error while loading this page.</p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
            {process.env.NODE_ENV === "development" && (
              <details
                style={{
                  marginTop: "2rem",
                  textAlign: "left",
                  background: "var(--surface)",
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                <summary>Error Details</summary>
                <pre
                  style={{
                    fontSize: "0.8rem",
                    overflow: "auto",
                    maxHeight: "200px",
                  }}
                >
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
