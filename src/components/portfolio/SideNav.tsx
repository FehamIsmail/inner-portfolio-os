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
        <div
            className={`flex flex-col w-[250px] fixed overflow-hidden border-retro-dark divide-retro-dark divide-y-3`}
            style={{ height: 'calc(100% - 44px)' }}
        >
            <div className="text-4xl font-nevrada p-[48px]">
                <h2 className="font-[600] -mb-4">Ismail</h2>
                <h2 className="font-[900] -mb-8">Feham</h2>
                <h4 className="font-nunito text-[20px] font-[700]">My Portfolio</h4>
            </div>
            <nav className="flex flex-col font-pixolde gap-2 p-[48px] pr-0 font-[800] text-xl">
                {navigationLinks.map((link) => (
                    <div key={`div-${link.name}`} className="flex flex-row items-center gap-2 mb-5">
                        {navOnFocus === link.name.toLowerCase() && (
                            <div className="w-2 h-2 bg-retro-dark rounded-full" />
                        )}
                        <Link className={"text-[28px]"} key={`link-${link.name}`} href={link.href}>
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
