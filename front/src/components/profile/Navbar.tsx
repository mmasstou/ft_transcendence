"use client"
import React, { useEffect, useState } from 'react';
import Friend from './Friend';
import Statistics from './Statistics';
import Historique from './Historique';


export const Navbar = () => {
    const links = ['Statistics', 'Friend', 'History']
    const [isActive, setActive] = useState<string>(links[0]);
    const [url, setUrl] = useState<string>('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUrl(window.location.toString());
        }
        const currentHash = window.location.hash.substring(1);
        if (links.includes(currentHash)) {
          setActive(currentHash);
        } else {
          setActive(links[0]);
        }
      }, []);

    const handleClick = (link : string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();
        setActive(link);
        window.location.hash = link;
        setUrl(window.location.toString());
    }
  return (
    <>
        <div className='bg-[#243230]'>
            <div className='flex justify-center items-center'>
                <div className='border-[1px] w-[300px] border-[#3D4042]'></div>
            </div>
            <nav className="flex items-center justify-start px-5 py-2">
                <ul className="flex items-center gap-5 text-white">
                    {links.map((link) => (
                        <li className="pointer-cursor" key={link}>
                        <a 
                            href={`#${link}`} 
                            className={`${isActive === link && 'text-secondary '}`}
                            onClick={handleClick(link)}
                        >{link}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
        <div >
            {
                (url === "http://localhost:3000/profile" || url === "http://localhost:3000/profile#Statistics") && <Statistics />
            }

            {
                (url === "http://localhost:3000/profile#History") && <Historique />
            } 
            {
                (url === "http://localhost:3000/profile#Friend") && <Friend />
            }
        </div>
    </>
  )
}
