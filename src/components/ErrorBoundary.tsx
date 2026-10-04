import { Component, type ReactNode } from 'react'

/**
 * Keeps one panel's failure from taking the whole page down with it: React
 * unmounts the entire tree on an uncaught render error, so a broken list of
 * sent requests would otherwise blank the signature studio too.
 */
export default class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: unknown) {
    console.error('[ErrorBoundary]', error)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
