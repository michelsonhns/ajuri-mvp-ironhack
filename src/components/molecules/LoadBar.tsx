import { useTranslation } from '../../i18n/LocaleProvider';
import { Box, Stack, Typography } from '@mui/material';
import { tokens } from '../../theme/tokens';
export function LoadBar({
  total,
  safety = 0,
  limit = 4,
}: {
  total: number;
  safety?: number;
  limit?: number;
}) {
  const { t } = useTranslation();
  return (
    <Stack gap={1}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {t('This month')}
        </Typography>
        <Typography variant="body2">
          {t(total)}
          {t(' / ')}
          {t(limit)}
          {t(total >= limit ? ' · at limit' : ' shifts')}
        </Typography>
      </Stack>
      <Box
        role="img"
        aria-label={t(
          `${total} of ${limit} shifts: Catering ${total - safety}, Safety Host ${safety}, Front desk 0`,
        )}
        sx={{
          height: 12,
          bgcolor: 'divider',
          position: 'relative',
          display: 'flex',
          '&::after': {
            content: '""',
            position: 'absolute',
            right: 0,
            top: -4,
            height: 20,
            width: 2,
            bgcolor: 'error.main',
          },
        }}
      >
        <Box
          sx={{
            width: `${Math.min((total - safety) / limit, 1) * 100}%`,
            bgcolor: tokens.color.cateringChart,
          }}
        />
        <Box
          sx={{
            width: `${(safety / limit) * 100}%`,
            bgcolor: tokens.color.safetyChart,
          }}
        />
      </Box>
      <Stack direction="row" gap={1.5} flexWrap="wrap">
        {[
          ['Front desk 0', tokens.color.primary],
          [`Catering ${total - safety}`, tokens.color.cateringChart],
          [`Safety Host ${safety}`, tokens.color.safetyChart],
        ].map(([label, color]) => (
          <Typography
            key={label}
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Box
              component="span"
              sx={{
                width: 10,
                height: 10,
                bgcolor: color,
                borderRadius: '2px',
              }}
            />
            {t(label)}
          </Typography>
        ))}
      </Stack>
    </Stack>
  );
}
