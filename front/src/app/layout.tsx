
import Login from '@/modals/Login';
import './globals.css';
import { Changa, Lato } from 'next/font/google';
import ConnectionAlert from '@/modals/connection.alert.modal';
import ChanneLCreateModaL from '@/modals/channel/channel.create.modaL';
import ChanneLAddFriendsModaL from '@/modals/channel/channel.add.friends.modaL';


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



export default function RootLayout({ children }: { children: React.ReactNode;})

{
    return (
        <html lang="en" >
            {/* <Login />
            <ChanneLCreateModaL />
            <ChanneLAddFriendsModaL />
            <ConnectionAlert /> */}
            <body className= {` ${lato.variable}`} suppressHydrationWarning={true}>
				{children}
            </body>
            
        </html>
    );
}
