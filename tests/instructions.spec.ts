import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('coordinator instructions advance from task 1 to task 3 and can be minimized', async ({
  page,
}) => {
  await page.goto('/#/coordinator');
  const instructions = page.getByRole('complementary', { name: 'Tester instructions' });
  await expect(instructions).toContainText('TASK 1');
  await expect(instructions).toContainText('How is today looking? And is the semester going well?');
  await instructions.getByRole('button', { name: 'Minimize task instructions' }).click();
  const restore = instructions.getByRole('button', { name: 'Show task instructions' });
  await expect(restore).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(
    instructions.getByRole('button', { name: 'Minimize task instructions' }),
  ).toBeFocused();
  await instructions.getByRole('button', { name: 'Next task →' }).click();
  await expect(instructions).toContainText('TASK 3');
  await expect(instructions).toContainText(
    'Pedro has reported that he can’t come. Find someone to cover his shift.',
  );
  await expect(page.getByText('Pedro Santos can’t come on Saturday')).toBeVisible();
  await page.getByRole('link', { name: 'See suggestions', exact: true }).click();
  await expect(instructions).toHaveCount(0);
});

test('task completion instructions follow the volunteer and coordinator journeys', async ({
  page,
}) => {
  await page.goto('/#/volunteer/pedro');
  const instructions = page.getByRole('complementary', { name: 'Tester instructions' });
  await expect(instructions).toContainText('TASK 2');
  await page.getByRole('link', { name: 'I can’t come', exact: true }).click();
  await expect(instructions).toHaveCount(0);
  await page.getByRole('button', { name: 'Tell Camila I can’t come' }).click();
  await expect(instructions).toContainText('END OF TASK 2');
  await instructions.getByRole('button', { name: 'Back to start' }).click();
  await expect(page.getByRole('heading', { name: 'Thank you for testing Ajuri!' })).toBeVisible();
  await page.getByRole('link', { name: 'Start as Ana' }).click();
  await expect(instructions).toContainText('TASK 4');
  await page.getByRole('button', { name: 'Accept replacement' }).click();
  await expect(instructions).toHaveCount(0);
  await page.getByRole('link', { name: 'See my Kitchen checklist' }).click();
  await expect(instructions).toContainText('END OF TASK 4');
  await page.goto('/#/coordinator');
  await expect(instructions).toContainText('END OF TASK 3');
  await expect(instructions).toContainText('From 1 (very difficult) to 7 (very easy)');
});

for (const width of [390, 1440]) {
  test(`instructions are accessible and leave actions reachable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1024 });
    for (const route of [
      '/coordinator',
      '/volunteer/pedro',
      '/volunteer/pedro/sent',
      '/volunteer/ana/request',
      '/volunteer/ana/checklist',
    ]) {
      await page.goto(`/#${route}`);
      const instructions = page.getByRole('complementary', { name: 'Tester instructions' });
      await expect(instructions).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations, route).toEqual([]);
      const box = await instructions.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      );
    }
    await page.goto('/#/volunteer/ana/request');
    await page.getByRole('button', { name: 'Accept replacement' }).click();
    await expect(page.getByRole('heading', { name: 'Thank you, Ana!' })).toBeVisible();
    await page.goto('/#/coordinator');
    await page.screenshot({
      path: `test-results/instructions-desktop-${width}.png`,
      fullPage: true,
    });
    await page.goto('/#/volunteer/pedro');
    await page.screenshot({
      path: `test-results/instructions-mobile-${width}.png`,
      fullPage: true,
    });
  });
}
