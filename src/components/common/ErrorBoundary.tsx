import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@heroui/react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };
  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary caught an error]:", error, errorInfo);
  }
  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };
  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-6 text-center">
          <div className="p-3 bg-danger/10 text-danger rounded-full mb-3">
            <FiAlertTriangle className="size-8" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            Something went wrong in this section
          </h3>
          <p className="text-xs text-foreground/60 max-w-sm mb-4">
            {this.state.error?.message || "An unexpected error occurred while rendering."}
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              color="primary"
              variant="flat"
              onPress={this.handleReset}
              startContent={<FiRefreshCw className="size-3.5" />}
            >
              Try Again
            </Button>
            <Button
              size="sm"
              variant="bordered"
              onPress={() => window.location.reload()}
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}