import { ptBR } from './ptBR';

export type Locale = 'en' | 'pt-BR';

function portuguese(text: string): string {
  const key = text.trim();
  if (Object.hasOwn(ptBR, key)) return text.replace(key, ptBR[key]);
  const rules: [RegExp, (...parts: string[]) => string][] = [
    [/^Request sent to (.+)$/, (name) => `Pedido enviado para ${name}`],
    [/^Who helps the (.+)\?$/, (team) => `Quem ajuda a ${portuguese(team)}?`],
    [/^Edit (.+)$/, (name) => `Editar ${name}`],
    [/^(\d+) volunteers selected$/, (count) => `${count} voluntários selecionados`],
    [/^(\d+) shifts, across all teams$/, (count) => `${count} turnos, em todas as equipes`],
    [
      /^Volunteers under the max load \((\d+) \/ month\)$/,
      (count) => `Voluntários abaixo da carga máxima (${count} / mês)`,
    ],
    [/^Catering (\d+)$/, (count) => `Cozinha ${count}`],
    [/^Safety Host (\d+)$/, (count) => `Segurança ${count}`],
    [/^Decrease (.+)$/, (label) => `Diminuir ${portuguese(label)}`],
    [/^Increase (.+)$/, (label) => `Aumentar ${portuguese(label)}`],
    [/^Select (.+)$/, (name) => `Selecionar ${name}`],
    [/^Task (\d+)$/, (number) => `Tarefa ${number}`],
    [/^END OF TASK (\d+)$/, (number) => `FIM DA TAREFA ${number}`],
    [/^(.+) accepted the Kitchen shift\.$/, (name) => `${name} aceitou o turno da Cozinha.`],
    [/^(.+) replaces Pedro$/, (name) => `${name} substitui Pedro`],
    [/^(.+) checklist$/, (job) => `Checklist de ${portuguese(job)}`],
    [
      /^Demo invitation prepared for (.+)\. No email was sent\.$/,
      (email) => `Convite de demonstração preparado para ${email}. Nenhum e-mail foi enviado.`,
    ],
    [
      /^(\d+) of (\d+) shifts: Catering (\d+), Safety Host (\d+), Front desk 0$/,
      (total, limit, kitchen, safety) =>
        `${total} de ${limit} turnos: Cozinha ${kitchen}, Segurança ${safety}, Recepção 0`,
    ],
  ];
  for (const [pattern, render] of rules) {
    const match = key.match(pattern);
    if (match) return text.replace(key, render(...match.slice(1)));
  }
  return text.replace(/ · goal under /g, ' · meta abaixo de ').replace(/ · goal /g, ' · meta ');
}

/** Translate presentation values only; identifiers and stored domain values remain stable. */
export function translate<T>(value: T, locale: Locale): T {
  if (locale === 'en') return value;
  if (typeof value === 'string') return portuguese(value) as T;
  if (Array.isArray(value)) return value.map((item) => translate(item, locale)) as T;
  return value;
}
