
import './globals.css';
import { Lato } from 'next/font/google';

const lato = Lato({ 
    weight: ['400', '700'],
    subsets: ['latin'],
    variable: '--font-lato',
 });



export default function RootLayout({ children }: { children: React.ReactNode;})

{
    return (
        <html lang="en" >
            <body className= {` ${lato.variable}`} suppressHydrationWarning={true}>
				{children}
            </body>
            
        </html>
    );
}
