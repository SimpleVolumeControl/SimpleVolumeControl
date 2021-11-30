const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './containers/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography'), require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#F97316',
          'primary-focus': '#EA580C',
          'primary-content': '#F5F5F4',
          secondary: '#7E22CE',
          'secondary-focus': '#6B21A8',
          'secondary-content': '#F5F5F4',
          accent: '#F5F5F4',
          'accent-focus': '#F5F5F4',
          'accent-content': '#292524',
          neutral: '#44403C',
          'neutral-focus': '#292524',
          'neutral-content': '#F5F5F4',
          'base-100': '#F5F5F4',
          'base-200': '#E7E5E4',
          'base-300': '#D6D3D1',
          'base-content': '#292524',
          info: '#0EA5E9',
          success: '#84CC16',
          warning: '#FACC15',
          error: '#EF4444',
        },
        dark: {
          primary: '#F97316',
          'primary-focus': '#EA580C',
          'primary-content': '#F5F5F4',
          secondary: '#7E22CE',
          'secondary-focus': '#6B21A8',
          'secondary-content': '#F5F5F4',
          accent: '#F5F5F4',
          'accent-focus': '#F5F5F4',
          'accent-content': '#292524',
          neutral: '#44403C',
          'neutral-focus': '#292524',
          'neutral-content': '#F5F5F4',
          'base-100': '#57534E',
          'base-200': '#44403C',
          'base-300': '#292524',
          'base-content': '#F5F5F4',
          info: '#0EA5E9',
          success: '#84CC16',
          warning: '#FACC15',
          error: '#EF4444',
        },
      },
    ],
  },
};
