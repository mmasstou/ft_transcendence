

import './globals.css';
import { Changa } from 'next/font/google';

const changa = Changa({ subsets: ['latin'] });

export const metadata = {
    title: 'Transcendence',
    description: 'Online Pong Game',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" >
            <body className= {`${changa.className} z-0`} suppressHydrationWarning={true}>{children}</body>
        </html>
    );
}
