import { createTheme } from '@mui/material/styles';
import { tokens } from './tokens';

export const theme = createTheme({
  palette: {
    primary: { main: tokens.color.primary },
    secondary: { main: tokens.color.muted, light: tokens.color.secondary },
    background: { default: tokens.color.surface, paper: tokens.color.card },
    text: { primary: tokens.color.text, secondary: tokens.color.muted },
    divider: tokens.color.outlineVariant,
    success: { main: tokens.color.success },
    error: { main: tokens.color.error },
    warning: { main: tokens.color.warning },
    info: { main: tokens.color.info },
  },
  shape: { borderRadius: tokens.radius.button },
  typography: {
    fontFamily: '"Nunito Sans", sans-serif',
    fontSize: 14,
    h1: { fontSize: 32, lineHeight: '40px', fontWeight: 800, color: tokens.color.primary },
    h2: { fontSize: 24, lineHeight: '32px', fontWeight: 700 },
    h3: { fontSize: 22, lineHeight: '28px', fontWeight: 700 },
    h4: { fontSize: 18, lineHeight: '26px', fontWeight: 600 },
    body1: { fontSize: 16, lineHeight: '24px' },
    body2: { fontSize: 14, lineHeight: '20px' },
    caption: { fontSize: 13, lineHeight: '18px' },
    button: { fontSize: 16, lineHeight: '24px', fontWeight: 700, textTransform: 'none' },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': { colorScheme: 'light' },
        '*:focus-visible': { outline: `3px solid ${tokens.color.primary}`, outlineOffset: 3 },
        body: { margin: 0 },
        'main[tabindex="-1"]:focus-visible': { outline: 'none' },
        '.skip-link': {
          position: 'fixed',
          top: -100,
          left: 16,
          zIndex: 2000,
          background: '#fff',
          padding: 16,
        },
        '.skip-link:focus': { top: 8 },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animation: 'none !important',
            transition: 'none !important',
            scrollBehavior: 'auto !important',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { minHeight: 48, minWidth: 48, paddingInline: 24, borderRadius: 12 },
        outlined: { borderWidth: 2 },
      },
    },
    MuiIconButton: { styleOverrides: { root: { minWidth: 48, minHeight: 48 } } },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: { root: { borderRadius: 20, boxShadow: 'none' } },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, borderRadius: 999, height: 32 },
        label: { paddingInline: 14 },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: 48,
          color: tokens.color.text,
          borderColor: tokens.color.outline,
          '&.Mui-selected': { background: tokens.color.secondary, color: tokens.color.primary },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { height: 8, borderRadius: 999, background: tokens.color.outlineVariant },
        bar: { borderRadius: 999 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 8, backgroundColor: '#fff' },
        notchedOutline: { borderColor: tokens.color.outline },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 16 },
        standardError: { background: tokens.color.errorContainer, color: tokens.color.error },
        standardInfo: { background: tokens.color.infoContainer, color: tokens.color.info },
        standardSuccess: { background: tokens.color.successContainer, color: tokens.color.success },
      },
    },
  },
});
