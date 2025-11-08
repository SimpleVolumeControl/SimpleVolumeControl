import '@testing-library/jest-dom/vitest';

vitest.mock('next-intl', () => ({
  useTranslations: (category: string) => (key: string) => `${category}.${key}`,
}));
