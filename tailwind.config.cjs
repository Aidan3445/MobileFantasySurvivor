/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'primary': '#674528',
        'secondary': '#B58553',
        'accent': '#DCC0A2',
        'navigation': '#CBFFC2',
        'background': '#E5BC8F',
        'card': '#EED8BE',
        'muted': '#F5F5F4',
        'muted-foreground': '#5E5955',
        'positive': '#28A53F',
        'destructive': '#FF3B30',
        'neutral': '#4b5563'
      },
      animation: {
        // fadeIn animation
        "fade-in": 'fade-in 0.25s ease-in forwards',
      },
      keyframes: {
        "fade-in": {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    }
  },
  future: { hoverOnlyWhenSupported: true },
  plugins: []
};
