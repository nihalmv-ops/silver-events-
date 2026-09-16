import React from 'react'
import { AlertTriangle, RotateCcw, Home } from 'lucide-react'
import { Button } from '../ui/Button'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Silver Catering caught error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/dashboard'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 max-w-lg mx-auto text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0f172a]">
            Operational View Encountered an Issue
          </h2>
          <p className="text-xs text-[#64748b]">
            {this.state.error?.message || 'An unexpected rendering error occurred in this module.'}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-4 h-4" />}
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Home className="w-4 h-4" />}
              onClick={this.handleReset}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
