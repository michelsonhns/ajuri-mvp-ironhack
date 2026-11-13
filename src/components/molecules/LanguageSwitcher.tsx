import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n/LocaleProvider';
import type { Locale } from '../../i18n/translate';
import { useEffect } from 'react';
export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    if (locale === 'pt-BR' && !query.has('lang')) {
      query.set('lang', locale);
      navigate({ pathname: location.pathname, search: query.toString() }, { replace: true });
    }
  }, [locale, location.pathname, location.search, navigate]);
  return (
    <Box
      component="nav"
      aria-label={locale === 'pt-BR' ? 'Idioma do protótipo' : 'Prototype language'}
      sx={{
        display: 'flex',
        justifyContent: 'end',
        px: 3,
        pt: 1,
        pb: 1,
      }}
    >
      <ToggleButtonGroup
        exclusive
        value={locale}
        aria-label={locale === 'pt-BR' ? 'Escolha o idioma' : 'Choose language'}
        size="small"
        onChange={(_, value: Locale | null) => {
          if (!value) return;
          setLocale(value);
          const query = new URLSearchParams(location.search);
          query.set('lang', value);
          navigate(
            {
              pathname: location.pathname,
              search: query.toString(),
            },
            {
              replace: true,
            },
          );
        }}
      >
        <ToggleButton value="en" lang="en">
          English
        </ToggleButton>
        <ToggleButton value="pt-BR" lang="pt-BR">
          Português (Brasil)
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
}
