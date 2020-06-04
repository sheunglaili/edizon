import React from "react";

interface Props {
  fallback?: React.ReactNode;
}

export default class ErrorBoundry extends React.Component<Props> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true, 
    };
  }

  render() {
    const { fallback, children } = this.props;
    if (this.state.hasError && fallback) {
      return fallback;
    }

    if (React.isValidElement(children)) {
      return React.cloneElement(children, { hasError: this.state.hasError });
    }

    return children;
  }
}
