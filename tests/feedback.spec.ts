import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { feedbackForm } from '../src/domain/feedback';

test.beforeEach(async ({ page }) => {
  // Do not submit or depend on the live third-party form in CI.
  await page.route('https://atom-condor-c96.notion.site/**', (route) => route.abort());
});

test('feedback is reachable from the welcome page and keeps an external fallback', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Give feedback', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Share your feedback' })).toBeVisible();
  await expect(page.locator('iframe[title="Ajuri satisfaction questionnaire"]')).toHaveAttribute(
    'src',
    feedbackForm.embedUrl,
  );
  const fallback = page.getByRole('link', { name: 'Open questionnaire in a new tab' });
  await expect(fallback).toHaveAttribute('href', feedbackForm.url);
  await expect(fallback).toHaveAttribute('target', '_blank');
  await expect(fallback).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(
    page.getByText('Your prototype data is not sent automatically.', { exact: false }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'Back to test roles' }).click();
  await expect(page.getByRole('heading', { name: 'Thank you for testing Ajuri!' })).toBeVisible();
});

test('task-end snackbars link to the questionnaire without losing demo state', async ({ page }) => {
  await page.goto('/#/volunteer/pedro/absence');
  await page.getByRole('button', { name: 'Tell Camila I can’t come' }).click();
  const instructions = page.getByRole('complementary', { name: 'Tester instructions' });
  await instructions.getByRole('link', { name: 'Give feedback' }).click();
  await expect(page).toHaveURL(/#\/feedback$/);
  await page.goto('/#/coordinator');
  await expect(page.getByText('Pedro Santos can’t come on Saturday')).toBeVisible();
  await page.goto('/#/volunteer/ana/checklist');
  await expect(instructions.getByRole('link', { name: 'Give feedback' })).toBeVisible();
});

for (const width of [390, 1440]) {
  test(`feedback page has an accessible shell at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1024 });
    await page.goto('/#/feedback');
    const results = await new AxeBuilder({ page })
      .exclude('iframe')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    await expect(page.getByRole('main')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Open questionnaire in a new tab' })).toBeFocused();
  });
}
