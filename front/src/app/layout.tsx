
import './globals.css';
import { Changa, Lato } from 'next/font/google';


const changa = Changa({ 
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-changa',
});

const lato = Lato({ 
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-lato',
 });

const metadata = {
    title: 'Transcendence',
    description: 'Online Pong Game',
};

export default function RootLayout({ children, }: { children: React.ReactNode;})

{
    return (
        <html lang="en" >
            <body className= {`${changa.variable} ${lato.variable}`} suppressHydrationWarning={true}>
				{children}
            </body>
            
        </html>
    );
}
