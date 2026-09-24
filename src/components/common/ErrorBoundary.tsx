import React from "react";

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error?: any }> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, info: any) { console.error("App error", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="text-slate-500 mt-2">The app hit an unexpected error. Try refreshing. One broken tool won’t crash the rest.</p>
            <button onClick={() => window.location.reload()} className="btn-primary mt-4">Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
