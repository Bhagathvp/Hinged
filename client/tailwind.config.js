/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    screens: {
      'sm': '576px',
      // => @media (min-width: 576px) { ... }

      'smd': '940px',

      'md': '1050px',
      // => @media (min-width: 960px) { ... }

      'lg': '1440px',
      // => @media (min-width: 1440px) { ... }
    },
    container: {
      center: true,
      
    },
   
    extend: {
      colors: {
        'header-top': '#B4245D',
        'header-bot': '#E72E66'
      },
      backgroundImage: {
        'goldBackground':'url("../public/Backgrounds/goldBackground.jpg")',
        'goldBackground1':'url("../public/Backgrounds/goldBackground1.jpeg")',
        'moneyBackground':'url("../public/Backgrounds/moneyBackground.jpg")',
        'loginPage': 'url("../src/assets/loginPage.png")'
      }
    },
  },
  plugins: [],
}

