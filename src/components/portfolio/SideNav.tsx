"use client"
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Experiences', href: '/experiences' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' },
];

const SideNav = () => {
    const [isHome, setIsHome] = React.useState(false);
    const navigation = usePathname();
    const [navOnFocus, setNavOnFocus] = React.useState<string>();

    useEffect(() => {
        setIsHome(navigation === '/');
        setNavOnFocus(navigation.substring(1));
    }, [navigation]);

    return (!isHome ? (
        <div className="font-vt323 w-[250px] h-[calc(100%-47px)] bg-retro-medium border-r-3 fixed overflow-hidden border-retro-dark divide-retro-dark divide-y-3">
            <div className="text-4xl p-[48px]">
                <h1 className="font-[600]">Ismail</h1>
                <h1 className="ml-2 font-[900]">Feham</h1>
                <h2 className="ml-2 font-[600] text-[22px]">Portfolio</h2>
            </div>
            <nav className="flex flex-col p-[48px] font-[800] text-xl">
                {navigationLinks.map((link) => (
                    <div key={`div-${link.name}`} className="flex flex-row items-center gap-2 mb-5">
                        {navOnFocus === link.name.toLowerCase() && (
                            <div className="w-2 h-2 bg-retro-dark rounded-full" />
                        )}
                        <Link key={`link-${link.name}`} href={link.href}>
                            {link.name}
                        </Link>
                    </div>
                ))}
            </nav>
        </div>
    ) : (
        <div className="" />
    ));
};

export default SideNav;
