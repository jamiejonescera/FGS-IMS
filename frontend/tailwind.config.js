// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./client/index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [require('daisyui')],
// }
/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: [
    "./client/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        ring: 'ring 0.5s ease-in-out 2',
      },
      keyframes: {
        ring: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(15deg)' },
          '75%': { transform: 'rotate(-15deg)' },
        },
      },
    },
  },
  plugins: [daisyui],
};

