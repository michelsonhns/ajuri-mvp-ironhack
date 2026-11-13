import { useTranslation } from '../i18n/LocaleProvider';
import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { Logo, Panel } from '../components/atoms/Primitives';
import { feedbackForms } from '../domain/feedback';
export function FeedbackPage() {
  const { t, locale } = useTranslation();
  const feedbackForm = feedbackForms[locale];
  return (
    <>
      <Box
        component="header"
        sx={{
          p: 3,
        }}
      >
        <Link to="/" aria-label={t('Ajuri prototype home')}>
          <Logo full />
        </Link>
      </Box>
      <Box
        component="main"
        id="main-content"
        tabIndex={-1}
        sx={{
          maxWidth: 1008,
          px: {
            xs: 2,
            md: 3,
          },
          mx: 'auto',
          py: 3,
        }}
      >
        <Typography variant="h1" component="h1">
          {t('Share your feedback')}
        </Typography>
        <Typography color="text.secondary" mt={1} mb={3}>
          {t(
            'Please submit one response after your test session. Rate only the tasks you tried and leave the others blank. Use a nickname or a made-up participant code. Your answers are saved in the researcher’s Notion workspace.',
          )}
        </Typography>
        <Panel
          sx={{
            mb: 3,
          }}
        >
          <Stack gap={2}>
            <Typography variant="h4" component="h2">
              {t('About this questionnaire')}
            </Typography>
            <Typography variant="body2">
              {t(
                'Task ease: 1 = very difficult, 7 = very easy. Overall satisfaction: 1 = very dissatisfied, 5 = very satisfied. Comments are optional.',
              )}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t(
                'Please do not include personal or sensitive information. Your prototype data is not sent automatically. To save your answers, complete the form and select Submit.',
              )}
            </Typography>
            <Button
              component="a"
              href={feedbackForm.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="outlined"
              sx={{
                alignSelf: 'start',
              }}
            >
              {t('Open questionnaire in a new tab')}
            </Button>
          </Stack>
        </Panel>
        <Box
          key={locale}
          component="iframe"
          src={feedbackForm.embedUrl}
          title={t('Ajuri satisfaction questionnaire')}
          loading="lazy"
          referrerPolicy="no-referrer"
          sx={{
            display: 'block',
            width: '100%',
            height: {
              xs: '78dvh',
              md: 900,
            },
            minHeight: 600,
            border: 1,
            borderColor: 'divider',
            borderRadius: '20px',
            bgcolor: 'background.paper',
          }}
        />
        <Stack direction="row" flexWrap="wrap" gap={2} mt={3} mb={3}>
          <Button component={Link} to="/">
            {t('Back to test roles')}
          </Button>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              alignSelf: 'center',
            }}
          >
            {t('If the form does not load, open the questionnaire in a new tab.')}
          </Typography>
        </Stack>
      </Box>
    </>
  );
}
