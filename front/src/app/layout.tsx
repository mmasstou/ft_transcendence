
import Login from '@/components/modals/Login';
import './globals.css';
import { Changa, Lato } from 'next/font/google';
import NewMessage from '@/components/modals/NewMessage';
import ConnectionAlert from '@/components/modals/connection.alert.modal';


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
            <Login />
            <NewMessage />
            <ConnectionAlert />
            <body className= {`${changa.variable} ${lato.variable}`} suppressHydrationWarning={true}>
				{children}
            </body>
            
        </html>
    );
}
