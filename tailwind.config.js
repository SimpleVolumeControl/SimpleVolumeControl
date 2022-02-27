const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './hooks/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    extend: {
      keyframes: {
        push: {
          '0%, 100%': { transform: 'scaleX(1)' },
          '50%': { transform: 'scaleX(1.05)' },
        },
      },
      animation: {
        push: 'push 500ms ease-in-out infinite',
      },
      boxShadow: {
        glow: '0 0 6px -1px rgb(0 0 0 / 0.1), 0 0 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: colors.orange[500],
          'primary-focus': colors.orange[600],
          'primary-content': colors.stone[100],
          secondary: colors.purple[700],
          'secondary-focus': colors.purple[800],
          'secondary-content': colors.stone[100],
          accent: colors.stone[100],
          'accent-focus': colors.stone[100],
          'accent-content': colors.stone[800],
          neutral: colors.stone[700],
          'neutral-focus': colors.stone[800],
          'neutral-content': colors.stone[100],
          'base-100': colors.stone[100],
          'base-200': colors.stone[200],
          'base-300': colors.stone[300],
          'base-content': colors.stone[800],
          info: colors.sky[500],
          success: colors.lime[500],
          warning: colors.yellow[400],
          error: colors.red[500],
        },
        dark: {
          primary: colors.orange[500],
          'primary-focus': colors.orange[600],
          'primary-content': colors.stone[100],
          secondary: colors.purple[700],
          'secondary-focus': colors.purple[800],
          'secondary-content': colors.stone[100],
          accent: colors.stone[100],
          'accent-focus': colors.stone[100],
          'accent-content': colors.stone[800],
          neutral: colors.stone[700],
          'neutral-focus': colors.stone[800],
          'neutral-content': colors.stone[100],
          'base-100': colors.stone[600],
          'base-200': colors.stone[700],
          'base-300': colors.stone[800],
          'base-content': colors.stone[100],
          info: colors.sky[500],
          success: colors.lime[500],
          warning: colors.yellow[400],
          error: colors.red[500],
        },
      },
    ],
  },
};
