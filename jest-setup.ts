import '@testing-library/jest-dom';

jest.mock('next-intl', () => ({
  useTranslations: (category: string) => (key: string) => `${category}.${key}`,
}));
