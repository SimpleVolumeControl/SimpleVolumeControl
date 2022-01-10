const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
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
          'base-100': '#57534E',
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
