import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('absence, replacement and checklist persist across role changes', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Start as Pedro' }).click();
  await page.getByRole('link', { name: 'I can’t come', exact: true }).click();
  await page.getByRole('button', { name: 'Tell Camila I can’t come' }).click();
  await expect(page.getByRole('heading', { name: 'Camila has been told' })).toBeVisible();
  await page.goto('/#/coordinator');
  await page.getByRole('link', { name: 'See suggestions', exact: true }).click();
  await page.getByRole('button', { name: 'Send request', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Request sent to Ana Costa' })).toBeVisible();
  await page.getByRole('link', { name: 'Continue as Ana' }).click();
  await page.getByRole('button', { name: 'Accept replacement' }).click();
  await page.getByRole('link', { name: 'See my Kitchen checklist' }).click();
  await page.getByRole('checkbox', { name: 'Label every container with today’s date' }).check();
  await page.reload();
  await expect(page.getByText('4 / 7 done')).toBeVisible();
  await page.goto('/#/coordinator');
  await expect(page.getByText('Kitchen · Ana Costa replaces Pedro')).toBeVisible();
});

test('declined request lets the coordinator ask the next candidate', async ({ page }) => {
  await page.goto('/#/volunteer/ana/request');
  await page.getByRole('button', { name: 'I can’t this time' }).click();
  await page.goto('/#/replacements');
  await page.getByRole('button', { name: 'Ask Rui' }).click();
  await expect(page.getByRole('heading', { name: 'Request sent to Rui Almeida' })).toBeVisible();
});

test('offline absence keeps the entered message and supports retry', async ({ page, context }) => {
  await page.goto('/#/volunteer/pedro/absence');
  await page.getByLabel('Message to Camila (optional)').fill('I cannot travel today.');
  await context.setOffline(true);
  await page.getByRole('button', { name: 'Tell Camila I can’t come' }).click();
  await expect(page.getByRole('alert')).toContainText('Your message wasn’t sent');
  await expect(page.getByLabel('Message to Camila (optional)')).toHaveValue(
    'I cannot travel today.',
  );
  await context.setOffline(false);
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { name: 'Camila has been told' })).toBeVisible();
});

test('profile edit and removal confirmation support keyboard navigation', async ({ page }) => {
  await page.goto('/#/volunteers');
  await page.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.getByLabel('Full name').fill('Ana Costa Silva');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('heading', { level: 1, name: 'Ana Costa Silva' })).toBeVisible();
  await page.getByRole('button', { name: 'Remove from team' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: 'Remove from team' })).toBeFocused();
});

for (const width of [390, 1440]) {
  test(`screens have no WCAG A/AA axe findings or horizontal overflow at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1024 });
    for (const route of [
      '/',
      '/coordinator',
      '/replacements',
      '/setup/1',
      '/setup/2',
      '/setup/3',
      '/volunteers',
      '/volunteer/pedro',
      '/volunteer/pedro/absence',
      '/volunteer/ana/request',
      '/volunteer/ana/checklist',
    ]) {
      await page.goto(`/#${route}`);
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations, `${width}px ${route}`).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth),
        `Overflow ${width}px ${route}`,
      ).toBe(true);
    }
  });
}

test('desktop and mobile visual references', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1024 });
  await page.goto('/');
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'test-results/start-desktop.png', fullPage: true });
  await page.goto('/#/coordinator');
  await page.screenshot({ path: 'test-results/board-desktop.png', fullPage: true });
  const assets = await page
    .locator('img')
    .evaluateAll((images) =>
      images.map((i) => ({
        src: i.getAttribute('src'),
        loaded: i instanceof HTMLImageElement && i.complete && i.naturalWidth > 0,
        width: i.getBoundingClientRect().width,
        height: i.getBoundingClientRect().height,
      })),
    );
  expect(assets.every((a) => a.loaded && a.width > 0 && a.height > 0)).toBe(true);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#/volunteer/pedro');
  await page.screenshot({ path: 'test-results/shifts-mobile.png', fullPage: true });
});
