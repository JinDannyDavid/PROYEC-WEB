/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/shared/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Superficies (elevación por papel)
        'paper-base': '#F5E6C8',      // Manila - canvas principal
        'paper-raised': '#FFFFFF',    // Tarjeta - hoja blanca encima
        'paper-sunken': '#E8DCC8',    // Input/área de entrada - hundido
        'paper-overlay': '#FAF5EB',   // Modal/overlay - papel ligeramente más claro
        
        // Tinta (jerarquía de texto)
        'ink-primary': '#1A1A2E',     // Negro suave - texto principal
        'ink-secondary': '#4A4A5A',   // Gris cálido - texto secundario
        'ink-tertiary': '#7A7A8A',    // Metadatos, labels
        'ink-muted': '#A0A0B0',       // Placeholders, disabled
        'ink-inverse': '#F5E6C8',     // Sobre superficies oscuras
        
        // Semánticos (del dominio agua/JASS)
        'pvc-blue': '#1E5F8A',        // Acción principal, navegación activa
        'stamp-red': '#C0392B',       // Deuda, corte, error, destrucción
        'stamp-blue': '#1A5FB4',      // Pagado, aprobado, completado
        'canal-green': '#2D7D32',     // Normal, al día, servicio OK
        'rust-warning': '#8B5A3C',    // Vencido pronto, presión baja
        'adobe': '#C66B3D',           // Acentos, bordes de sección
        
        // Bordes (progresión de intensidad)
        'border-subtle': '#D4C4A8',   // Separación suave
        'border-standard': '#B8A080', // Bordes de tarjeta, input
        'border-emphasis': '#8B6B4A', // Divisores de sección
        'border-focus': '#1E5F8A',    // Focus ring
        
        // Legacy (para compatibilidad temporal)
        'jass-primary': '#1E5F8A',
        'jass-secondary': '#1A5FB4',
        'jass-accent': '#2D7D32',
        'jass-dark': '#1A1A2E',
        'jass-light': '#F5E6C8',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      spacing: {
        '0': '0',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '24px',
        '6': '32px',
        '7': '48px',
        '8': '64px',
      },
      borderRadius: {
        'control': '4px',
        'card': '8px',
        'sheet': '12px',
        'pill': '9999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'sheet': '0 4px 24px -8px rgba(26, 26, 46, 0.12), 0 0 0 1px rgba(139, 107, 74, 0.08)',
        'card': '0 2px 12px -4px rgba(26, 26, 46, 0.08), 0 0 0 1px rgba(184, 160, 128, 0.4)',
        'raised': '0 8px 32px -12px rgba(26, 26, 46, 0.16), 0 0 0 1px rgba(139, 107, 74, 0.1)',
      },
    },
  },
  plugins: [],
};