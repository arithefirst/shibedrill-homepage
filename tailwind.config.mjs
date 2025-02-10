/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui';
import typography from '@tailwindcss/typography';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Hack-Term-Font', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  daisyui: {
    themes: [
      {
        dark: {
          primary: '#95b7e0',
          secondary: '#205491',
          accent: '#3582df',
          neutral: '#152637',
          'base-100': '#181825',
          'base-content': '#e5ebf3',
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
  plugins: [daisyui, typography]
};
