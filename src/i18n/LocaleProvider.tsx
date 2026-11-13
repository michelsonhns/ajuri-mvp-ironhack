import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { translate, type Locale } from './translate';

function initialLocale(): Locale {
  const parameters = new URLSearchParams(
    window.location.hash.split('?')[1] ?? window.location.search,
  );
  const requested = parameters.get('lang');
  if (requested === 'pt-BR' || requested === 'en') return requested;
  try {
    return localStorage.getItem('ajuri-locale') === 'pt-BR' ? 'pt-BR' : 'en';
  } catch {
    return 'en';
  }
}

const LocaleContext = createContext<{ locale: Locale; setLocale: (locale: Locale) => void } | null>(
  null,
);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  useEffect(() => {
    document.documentElement.lang = locale;
    try {
      localStorage.setItem('ajuri-locale', locale);
    } catch {
      /* Language still works without storage. */
    }
  }, [locale]);
  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTranslation() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useTranslation requires LocaleProvider');
  return { ...context, t: <T,>(value: T): T => translate(value, context.locale) };
}
