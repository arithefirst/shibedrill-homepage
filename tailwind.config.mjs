/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  daisyui: {
    themes: [
      {
        dark: {
          primary: '#23b0ff',
          secondary: '#2286c0',
          accent: '#7692ff',
          neutral: '#ff00ff',
          'base-100': '#1d212c',
          info: '#0000ff',
          success: '#248232',
          warning: '#fde74c',
          error: '#ff3a20',

          '--rounded-box': '0.25rem',
          '--rounded-btn': '0.25rem',
          '--rounded-badge': '0.25rem',
          '--animation-btn': '0.4s',
          '--animation-input': '0.2s'
        }
      }
    ]
  },
  plugins: [daisyui]
};
