/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#FFFFFF',
                surface: '#FDFBF7',
                primary: {
                    DEFAULT: '#FBBF24', // Jaune Orangé - Saadé Golden
                    dark: '#D97706',
                },
                accent: '#EC4899', // Pink - Saadé Sweetness
                card: '#FFFFFF',
                text: '#1A1A1A',
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    'from': { boxShadow: '0 0 5px #3b82f6' },
                    'to': { boxShadow: '0 0 20px #3b82f6' },
                }
            }
        },
    },
    plugins: [],
}
