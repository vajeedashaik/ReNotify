import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        status: {
          active: '#10b981',
          expiring: '#f59e0b',
          expired: '#ef4444',
        },
      },
      boxShadow: {
 feature/scroll-down-animated-landing-page
        'soft': '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 20px rgba(20, 184, 166, 0.3)',
        'glow-lg': '0 0 30px rgba(20, 184, 166, 0.4)',
        'glow-accent': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-accent-lg': '0 0 30px rgba(99, 102, 241, 0.4)',
        'dark-soft': '0 2px 8px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)',
        'dark-soft-lg': '0 4px 16px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
      },
      backdropBlur: {
        'xs': '2px',

        'soft': '0 2px 8px rgba(0, 0, 0, 0.06), 0 1px 4px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.25)',
        'glow-lg': '0 0 30px rgba(59, 130, 246, 0.3)',
 main
      },
      borderRadius: {
        'card': '12px',
        'button': '8px',
      },
 feature/scroll-down-animated-landing-page
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'scale-in-hover': 'scaleInHover 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
 main
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
 feature/scroll-down-animated-landing-page
        scaleInHover: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },

        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(10px, -15px) rotate(5deg)' },
          '50%': { transform: 'translate(-5px, -25px) rotate(-3deg)' },
          '75%': { transform: 'translate(-15px, -10px) rotate(4deg)' },
        },
        floatReverse: {
          '0%, 100%': { transform: 'translate(0, 0) rotate(0deg)' },
          '25%': { transform: 'translate(-12px, 10px) rotate(-4deg)' },
          '50%': { transform: 'translate(8px, 20px) rotate(3deg)' },
          '75%': { transform: 'translate(15px, 5px) rotate(-5deg)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(-20px, -20px) scale(1.05)' },
          '66%': { transform: 'translate(15px, 10px) scale(0.95)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'float': 'float 12s ease-in-out infinite',
        'float-reverse': 'floatReverse 14s ease-in-out infinite',
        'float-slow': 'floatSlow 18s ease-in-out infinite',
 main
      },
    },
  },
  plugins: [],
}
export default config
