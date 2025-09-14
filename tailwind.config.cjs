/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#674528',
        secondary: '#B58553',
        accent: '#DCC0A2',
        navigation: '#CBFFC2',
        background: '#E5BC8F',
        card: '#EED8BE',

      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [],
};
