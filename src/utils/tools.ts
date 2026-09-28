import { tools, type ToolItem } from '@/mocks/tools';

export type ToolArticle = {
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
};

const FINANCE_KEYWORDS = [
  'investment',
  'budget',
  'pricing',
  'price',
  'finance',
  'mortgage',
  'loan',
  'emi',
  'cost',
  'money',
  'yield',
  'rental',
  'rent',
  'return',
  'bank',
  'legal',
  'documents',
];

const TOOL_KEYWORDS: Record<string, string[]> = {
  'mortgage-calculator': ['buying', 'budget', 'finance', 'mortgage', 'loan', 'emi', 'bank', 'home'],
  'rental-yield-calculator': ['investment', 'yield', 'rental', 'rent', 'income', 'return', 'renting'],
  'stamp-duty-calculator': [
    'buying',
    'cost',
    'documents',
    'legal',
    'transfer',
    'registration',
    'budget',
    'price',
  ],
};

function haystackOf(article: ToolArticle): string {
  return [article.category, article.title, article.excerpt, ...article.tags].join(' ').toLowerCase();
}

export function isFinanceArticle(article: ToolArticle): boolean {
  const haystack = haystackOf(article);
  return FINANCE_KEYWORDS.some((keyword) => haystack.includes(keyword));
}

/**
 * Picks the most relevant free tools for an article. Finance-related pieces always
 * surface the mortgage calculator, and tag/title matches drive the rest.
 */
export function getRelatedTools(article: ToolArticle, limit = 2): ToolItem[] {
  const haystack = haystackOf(article);

  const scored = tools
    .map((tool) => {
      const keywords = TOOL_KEYWORDS[tool.key] ?? [];
      const score = keywords.reduce(
        (sum, keyword) => (haystack.includes(keyword) ? sum + 1 : sum),
        0,
      );
      return { tool, score };
    })
    .sort((a, b) => b.score - a.score);

  const matched = scored.filter((entry) => entry.score > 0).map((entry) => entry.tool);

  if (isFinanceArticle(article)) {
    const mortgage = tools.find((tool) => tool.key === 'mortgage-calculator');
    if (mortgage && !matched.some((tool) => tool.key === mortgage.key)) {
      matched.unshift(mortgage);
    }
  }

  const list = matched.length > 0 ? matched : tools;
  return list.slice(0, limit);
}