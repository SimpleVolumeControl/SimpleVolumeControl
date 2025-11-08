import { defineConfig } from 'vitest/config';
// @ts-expect-error Will be fixed once the project is migrated to ESM.
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'client',
          include: [
            '(components|hooks|app)/**/__tests__/**/*.[jt]s?(x)',
            '(components|hooks|app)/**/?(*.)+(spec|test).[jt]s?(x)',
          ],
          environment: 'jsdom',
          setupFiles: ['./vitest-setup.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'server',
          include: [
            '(common|model|server|utils)/**/__tests__/**/*.[jt]s?(x)',
            '(common|model|server|utils)/**/?(*.)+(spec|test).[jt]s?(x)',
          ],
          environment: 'node',
        },
      },
    ],
  },
});
