import { useTranslation } from '../../i18n/LocaleProvider';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  Snackbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import type { TestInstruction } from '../../domain/testInstructions';
import { tokens } from '../../theme/tokens';
import { Link } from 'react-router-dom';
interface Props {
  instruction: TestInstruction;
  onAction: () => void;
  aboveNavigation: boolean;
}
export function InstructionSnackbar({ instruction, onAction, aboveNavigation }: Props) {
  const { t } = useTranslation();
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const compact = instruction.compact || smallScreen;
  const [collapsed, setCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const bottom = aboveNavigation && smallScreen ? 88 : compact ? 16 : 24;

  // Reserve the measured space so the persistent overlay cannot hide page actions.
  useLayoutEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const measure = () => {
      document.documentElement.style.setProperty(
        '--tester-instructions-height',
        `${Math.ceil(element.getBoundingClientRect().height) + bottom + 16}px`,
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      observer.disconnect();
      document.documentElement.style.removeProperty('--tester-instructions-height');
    };
  }, [bottom, collapsed]);
  const toggle = () => {
    setCollapsed((value) => !value);
    requestAnimationFrame(() => toggleRef.current?.focus());
  };
  const action = instruction.action && (
    <Button
      variant="contained"
      onClick={onAction}
      sx={{
        bgcolor: tokens.color.secondary,
        color: tokens.color.primary,
        flexShrink: 0,
        width: compact ? '100%' : 'auto',
        '&:hover': {
          bgcolor: tokens.color.secondary,
        },
      }}
    >
      {t(instruction.action === 'next-task' ? 'Next task →' : 'Back to start')}
    </Button>
  );
  const close = (
    <IconButton
      ref={toggleRef}
      onClick={toggle}
      aria-label={t('Minimize task instructions')}
      aria-expanded="true"
      aria-controls="tester-instruction-copy"
      sx={{
        color: tokens.color.onPrimary,
        bgcolor: tokens.color.muted,
        width: 44,
        height: 44,
        minWidth: 44,
        minHeight: 44,
        fontSize: 18,
        flexShrink: 0,
        '&:hover': {
          bgcolor: tokens.color.muted,
        },
        '&:focus-visible': {
          outlineColor: tokens.color.secondary,
        },
      }}
    >
      <span aria-hidden="true">{t('×')}</span>
    </IconButton>
  );
  return (
    <Snackbar
      open
      transitionDuration={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      // Instructions stay available until explicitly minimized or the task changes.
      onClose={(_, reason) => {
        if (reason === 'escapeKeyDown' && !collapsed) toggle();
      }}
      sx={{
        bottom: {
          xs: bottom,
          sm: bottom,
        },
        left: {
          xs: '50%',
          sm: '50%',
        },
        right: 'auto',
        transform: 'translateX(-50%)',
        width: collapsed ? 'auto' : 'calc(100% - 32px)',
        maxWidth: compact ? 358 : 1100,
      }}
    >
      <Box
        ref={containerRef}
        component="aside"
        aria-label={t('Tester instructions')}
        sx={{
          width: '100%',
          bgcolor: tokens.color.text,
          color: tokens.color.onPrimary,
          borderRadius: '16px',
          boxShadow: '0 4px 8px rgb(0 0 0 / 20%)',
          p: collapsed ? 0 : compact ? '12px 12px 12px 16px' : '16px 16px 16px 24px',
          display: 'flex',
          flexDirection: compact ? 'column' : 'row',
          alignItems: compact ? 'stretch' : 'center',
          gap: compact ? 1 : 3,
        }}
      >
        {collapsed ? (
          <Button
            ref={toggleRef}
            onClick={toggle}
            aria-expanded="false"
            sx={{
              color: tokens.color.onPrimary,
              whiteSpace: 'nowrap',
              '&:focus-visible': {
                outlineColor: tokens.color.secondary,
              },
            }}
          >
            {t('Show task instructions')}
          </Button>
        ) : (
          <>
            {compact && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.color.catering,
                    flex: 1,
                    fontWeight: 600,
                  }}
                >
                  {t(instruction.title)}
                </Typography>
                {t(close)}
              </Box>
            )}
            <Box
              id="tester-instruction-copy"
              role="status"
              aria-live="polite"
              aria-atomic="true"
              sx={{
                flex: 1,
                minWidth: 0,
              }}
            >
              {!compact && (
                <Typography
                  variant="body2"
                  sx={{
                    color: tokens.color.catering,
                    fontWeight: 600,
                    mb: '2px',
                  }}
                >
                  {t(instruction.title)}
                </Typography>
              )}
              <Typography variant="body2">{t(instruction.description)}</Typography>
            </Box>
            {instruction.action === 'back-to-start' && (
              <Button
                component={Link}
                to="/feedback"
                variant="outlined"
                sx={{
                  color: tokens.color.onPrimary,
                  borderColor: tokens.color.secondary,
                  flexShrink: 0,
                  width: compact ? '100%' : 'auto',
                  '&:focus-visible': {
                    outlineColor: tokens.color.secondary,
                  },
                }}
              >
                {t('Give feedback')}
              </Button>
            )}
            {t(action)}
            {t(!compact && close)}
          </>
        )}
      </Box>
    </Snackbar>
  );
}
