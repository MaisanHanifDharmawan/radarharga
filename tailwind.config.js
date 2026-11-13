/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Peta token DESIGN.md §3 — jangan pakai warna/radius di luar ini untuk UI publik
        kertas: '#F8FAF7',
        tinta: { DEFAULT: '#12233B', muda: '#4B5B6E' },
        karton: '#FFD84D',
        cabai: { DEFAULT: '#C4122F', karton: '#A50F28' },
        daun: { DEFAULT: '#12703F', karton: '#0F6B3A' },
        garis: '#D5DBD3',
      },
      fontFamily: {
        angka: ['"Barlow Condensed"', '"Arial Narrow"', 'sans-serif'],
        isi: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        500: '500',
        600: '600',
        700: '700',
      },
      borderRadius: {
        chip: '2px',
        kontrol: '8px',
        panel: '12px',
      },
      boxShadow: {
        papan: '6px 6px 0 #12233B',
      },
      maxWidth: {
        konten: '1120px',
      },
    },
  },
  plugins: [],
}
