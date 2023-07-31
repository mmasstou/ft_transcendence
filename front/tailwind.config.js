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
              slideUpAndFade: {
                from: { opacity: 0, transform: 'translateY(2px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
              slideRightAndFade: {
                from: { opacity: 0, transform: 'translateX(-2px)' },
                to: { opacity: 1, transform: 'translateX(0)' },
              },
              slideDownAndFade: {
                from: { opacity: 0, transform: 'translateY(-2px)' },
                to: { opacity: 1, transform: 'translateY(0)' },
              },
              slideLeftAndFade: {
                from: { opacity: 0, transform: 'translateX(2px)' },
                to: { opacity: 1, transform: 'translateX(0)' },
              },
            },
            animation: {
              slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
              slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
              slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
              slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        },
    },
    plugins: [],
};
