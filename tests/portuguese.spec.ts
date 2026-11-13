import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { feedbackForms } from '../src/domain/feedback';

test.beforeEach(async ({ page }) => {
  await page.route('https://atom-condor-c96.notion.site/**', (route) => route.abort());
});

test('Brazilian Portuguese covers the complete absence and replacement journey', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Português (Brasil)', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Português (Brasil)', exact: true })).toBeFocused();
  await expect(page.locator('html')).toHaveAttribute('lang', 'pt-BR');
  await expect(page.getByRole('heading', { name: 'Obrigado por testar o Ajuri!' })).toBeVisible();
  await page.getByRole('link', { name: 'Começar como Pedro' }).click();
  await page.getByRole('link', { name: 'Não posso ir', exact: true }).click();
  await expect(page.getByLabel('Mensagem para Camila (opcional)')).toHaveValue(
    'Desculpe, estou com febre…',
  );
  await page.getByRole('button', { name: 'Avisar à Camila que não posso ir' }).click();
  await expect(page.getByRole('heading', { name: 'Camila foi avisada' })).toBeVisible();
  await page.goto('/#/coordinator');
  await expect(page.getByRole('heading', { level: 1, name: 'Painel ao vivo' })).toBeVisible();
  await page.getByRole('link', { name: 'Ver sugestões', exact: true }).click();
  await page.getByRole('button', { name: 'Enviar pedido', exact: true }).first().click();
  await expect(page.getByRole('heading', { name: 'Pedido enviado para Ana Costa' })).toBeVisible();
  await page.getByRole('link', { name: 'Continuar como Ana' }).click();
  await page.getByRole('button', { name: 'Aceitar substituição' }).click();
  await page.getByRole('link', { name: 'Ver meu checklist da Cozinha' }).click();
  await page
    .getByRole('checkbox', { name: 'Identifique todos os recipientes com a data de hoje' })
    .check();
  await expect(page.getByText('4 / 7 concluídos')).toBeVisible();
  await page.getByRole('link', { name: 'Dar minha opinião' }).click();
  await expect(
    page.getByRole('heading', { name: 'Compartilhe sua opinião', level: 1 }),
  ).toBeVisible();
  await expect(page.locator('iframe')).toHaveAttribute('src', feedbackForms['pt-BR'].embedUrl);
  await expect(
    page.getByRole('link', { name: 'Abrir questionário em uma nova aba' }),
  ).toHaveAttribute('href', feedbackForms['pt-BR'].url);
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('iframe')).toHaveAttribute('src', feedbackForms.en.embedUrl);
  await page.goto('/#/coordinator');
  await expect(page.getByText('Kitchen · Ana Costa replaces Pedro')).toBeVisible();
});

test('a PT-BR link sets the language and preserves it across navigation and reload', async ({
  page,
}) => {
  await page.goto('/#/?lang=pt-BR');
  await page.getByRole('link', { name: 'Começar como Camila' }).click();
  await expect(page.getByRole('complementary', { name: 'Instruções para o teste' })).toContainText(
    'TAREFA 1',
  );
  await page.getByRole('button', { name: 'Próxima tarefa →' }).click();
  await expect(page.getByRole('complementary', { name: 'Instruções para o teste' })).toContainText(
    'TAREFA 3',
  );
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Painel ao vivo' })).toBeVisible();
  await expect(page).toHaveTitle('Painel ao vivo · Ajuri');
});

for (const width of [390, 1440]) {
  test(`PT-BR screens remain accessible without overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1024 });
    for (const route of [
      '/',
      '/coordinator',
      '/setup/1',
      '/setup/2',
      '/setup/3',
      '/volunteers',
      '/volunteer/pedro',
      '/volunteer/pedro/absence',
      '/volunteer/ana/request',
      '/volunteer/ana/checklist',
      '/feedback',
    ]) {
      await page.goto(`/#${route}?lang=pt-BR`);
      const results = await new AxeBuilder({ page })
        .exclude('iframe')
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      expect(results.violations, route).toEqual([]);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        route,
      ).toBe(true);
      if (['/', '/coordinator', '/volunteer/pedro', '/volunteer/pedro/absence'].includes(route)) {
        await page.screenshot({
          path: `test-results/pt-${width}-${route.replaceAll('/', '-') || 'home'}.png`,
          fullPage: true,
        });
      }
    }
  });
}
