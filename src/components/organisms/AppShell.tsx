import { useTranslation } from '../../i18n/LocaleProvider';
import {
  Box,
  Button,
  IconButton,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { DesignIcon, Initials, Logo, type IconName } from '../atoms/Primitives';
const navigation: [string, string, IconName][] = [
  ['/coordinator', 'Live board', 'layers'],
  ['/schedule', 'Schedule', 'calendar'],
  ['/volunteers', 'Volunteers', 'users'],
  ['/checklists', 'Checklists', 'checklist'],
];
export function AppShell({
  title,
  children,
  filter,
  onFilter,
}: {
  title: string;
  children: React.ReactNode;
  filter?: string;
  onFilter?: (value: string) => void;
}) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  return (
    <Box
      sx={{
        pl: {
          xs: 0,
          md: '80px',
        },
        pb: {
          xs: '88px',
          md: 3,
        },
        minHeight: '100dvh',
      }}
    >
      <Box
        component="nav"
        aria-label={t('Main navigation')}
        sx={{
          position: 'fixed',
          zIndex: 1100,
          left: 0,
          top: {
            md: 0,
          },
          bottom: 0,
          width: {
            xs: '100%',
            md: 80,
          },
          bgcolor: 'background.paper',
          borderRight: {
            md: 1,
          },
          borderTop: {
            xs: 1,
            md: 0,
          },
          borderColor: 'divider',
          display: 'flex',
          flexDirection: {
            xs: 'row',
            md: 'column',
          },
          alignItems: 'center',
          gap: {
            md: 1.5,
          },
          py: {
            xs: 1,
            md: 3,
          },
        }}
      >
        <Box
          component={Link}
          to="/"
          aria-label={t('Ajuri prototype home')}
          sx={{
            mb: 4,
            display: {
              xs: 'none',
              md: 'block',
            },
          }}
        >
          <Logo />
        </Box>
        {navigation.map(([to, label, icon]) => (
          <Button
            key={to}
            component={Link}
            to={to}
            aria-current={
              pathname === to || (to === '/coordinator' && pathname === '/replacements')
                ? 'page'
                : undefined
            }
            sx={{
              p: 0.5,
              minWidth: 0,
              width: {
                xs: '25%',
                md: 80,
              },
              fontSize: 13,
              fontWeight: 600,
              color: 'text.secondary',
              flexDirection: 'column',
              gap: 0.5,
              '&[aria-current]': {
                color: 'text.primary',
                '& .nav-icon': {
                  backgroundColor: '#f1f2fc',
                },
              },
            }}
          >
            <Box
              className="nav-icon"
              sx={{
                width: 56,
                height: 32,
                display: 'grid',
                placeItems: 'center',
                borderRadius: 999,
              }}
            >
              <DesignIcon name={icon} />
            </Box>
            {t(label)}
          </Button>
        ))}
        <Button
          component={Link}
          to="/"
          sx={{
            mt: 'auto',
            fontSize: 12,
            display: {
              xs: 'none',
              md: 'flex',
            },
          }}
        >
          {t('Test roles')}
        </Button>
      </Box>
      <Stack
        component="header"
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          minHeight: 72,
          px: 3,
          flexWrap: 'wrap',
          py: 1,
        }}
      >
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Typography variant="h2" component="h1" color="primary">
            {t(title)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('Saturday 14 November · 3 teams')}
          </Typography>
        </Box>
        {onFilter && (
          <ToggleButtonGroup
            size="small"
            exclusive
            value={filter}
            onChange={(_, v: string | null) => v && onFilter(v)}
            aria-label={t('Filter by team')}
            sx={{
              display: {
                xs: 'none',
                lg: 'flex',
              },
              '& .MuiToggleButton-root': {
                px: 2,
                minHeight: 40,
              },
            }}
          >
            {['All', 'Front desk', 'Safety Host', 'Catering'].map((team) => (
              <ToggleButton key={team} value={team}>
                {filter === team && (
                  <Box
                    sx={{
                      mr: 1,
                    }}
                  >
                    <DesignIcon name="check" />
                  </Box>
                )}
                {t(team)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        )}
        <IconButton
          component={Link}
          to="/replacements"
          aria-label={t('View absence notifications')}
        >
          <DesignIcon name="bell" />
        </IconButton>
        <Initials name="Camila Ferreira" />
      </Stack>
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          px: {
            xs: 2,
            md: 3,
          },
          pt: 3,
          outline: 'none',
        }}
      >
        {t(children)}
      </Box>
    </Box>
  );
}
