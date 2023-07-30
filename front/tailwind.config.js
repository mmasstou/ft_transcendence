/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            fontFamily: {
                // lato : 'var(--font-lato)',
                changa : 'var(--font-changa)',
            },
            colors: {
                primary: '#161F1E',
                secondary: '#1EF0AE',
                tertiary: '#D9D9D9',
                danger: '#F1453E',
                btn: '#161F1E',
                isban: '#F03F19',
                IsActive: '#ED6C03',
                container: '#3E504D'
            },
            keyframes: {
                overlayShow: {
                  from: { opacity: 0 },
                  to: { opacity: 1 },
                },
                contentShow: {
                  from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
                  to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
                },
              },
              animation: {
                overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
              },
        },
    },
    plugins: [],
};
