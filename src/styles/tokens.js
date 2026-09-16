/**
 * SILVER CATERING — Centralized Design System Tokens
 * Defines the unified visual identity for the entire administration platform.
 */
export const tokens = {
  brand: {
    name: 'SILVER CATERING',
    subtitle: 'Event Administration & Operations',
  },
  colors: {
    // Primary: Deep Forest Emerald Slate (Refined & Authoritative)
    primary: {
      DEFAULT: '#163324',
      dark: '#0e1f16',
      light: '#214734',
      subtle: '#eaf1ec',
      hover: '#11271b',
    },
    // Secondary: Warm Champagne Brass / Warm Gold (Luxury hospitality touch)
    secondary: {
      DEFAULT: '#c29c5e',
      gold: '#9d8050',
      light: '#f5ede0',
      dark: '#866a39',
      hover: '#af8949',
    },
    // Surfaces & Backgrounds
    background: '#f8fafc',
    surface: {
      DEFAULT: '#ffffff',
      subtle: '#fbfcfd',
      muted: '#f1f5f9',
    },
    // Typography
    text: {
      primary: '#0f172a',
      secondary: '#334155',
      muted: '#64748b',
      subtle: '#94a3b8',
      inverse: '#ffffff',
    },
    // Borders & Dividers
    border: {
      DEFAULT: '#e2e8f0',
      subtle: '#edf2f7',
      focus: '#163324',
    },
    // Semantic Status Tokens
    status: {
      success: {
        bg: '#ecfdf5',
        text: '#065f46',
        border: '#a7f3d0',
        solid: '#10b981',
      },
      warning: {
        bg: '#fffbeb',
        text: '#92400e',
        border: '#fde68a',
        solid: '#f59e0b',
      },
      error: {
        bg: '#fef2f2',
        text: '#991b1b',
        border: '#fecaca',
        solid: '#ef4444',
      },
      info: {
        bg: '#f0f9ff',
        text: '#075985',
        border: '#bae6fd',
        solid: '#0284c7',
      },
    },
  },
  typography: {
    fontFamily: {
      sans: "'Outfit', system-ui, sans-serif",
      serif: "'Playfair Display', Georgia, serif",
    },
  },
  radii: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    card: '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)',
    cardHover: '0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
    dropdown: '0 10px 30px -5px rgba(15, 23, 42, 0.12)',
    modal: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
  }
}

export default tokens

