"use client"
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavigationLinkType {
    name: string;
    href: string;
}

const navigationLinks: NavigationLinkType[] = [
    { name: 'Home',         href: '/' },
    { name: 'About',        href: '/about' },
    { name: 'Experiences',  href: '/experiences' },
    { name: 'Projects',     href: '/projects' },
    { name: 'Contact',      href: '/contact' },
];

const projectsLinks: NavigationLinkType[] = [
    { name: 'Software', href: '/projects/software' },
    { name: 'Business', href: '/projects/business' },
    { name: 'Arts',     href: '/projects/arts' },
];


const SideNav = () => {
    const [isHome, setIsHome] = React.useState(false);
    const [expandProjects, setExpandProjects] = React.useState(false);
    const [navOnFocus, setNavOnFocus] = React.useState<string>();
    const navigation = usePathname();

    useEffect(() => {
        setIsHome(navigation === '/');
        setExpandProjects(navigation.includes('projects'));
        const url = navigation.split('/');
        setNavOnFocus(url[url.length - 1]);
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
                {navigationLinks.map((link, index) => (
                    <React.Fragment key={`nav-link-${index}`}>
                        {!link.href.includes('/projects/') && (
                            <CustomLink
                                key={`component-link-${link.name}-${index}`}
                                size={28}
                                margin={10}
                                name={link.name}
                                href={link.href}
                                isFocused={navOnFocus === link.name.toLowerCase()}
                            />
                        )}
                        {expandProjects && link.name === 'Projects' && (
                            <div className="flex flex-col gap-1 -mt-2 mb-1 ml-8" key={`expanded-nav-${index}`}>
                                {projectsLinks.map((subLink, subIndex) => (
                                    <CustomLink
                                        key={`sub-link-${subLink.name}-${subIndex}`}
                                        margin={0}
                                        size={26}
                                        name={subLink.name}
                                        href={subLink.href}
                                        isFocused={navOnFocus === subLink.name.toLowerCase()}
                                    />
                                ))}
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </div>
    ) : (
        <div className="" />
    ));
};

interface CustomLinkProps {
    name: string;
    href: string;
    size: number;
    margin: number;
    isFocused: boolean;
}
const CustomLink = (props: CustomLinkProps) => {
    const { name, href, isFocused, size, margin } = props;
    return (
        <div className={'flex flex-row items-center gap-2'} style={{ marginBottom: `${margin}px` }}>
            {isFocused && <div className="w-2 h-2 bg-retro-dark rounded-full" />}
            <Link href={href} key={`link-${name}`} style={{ fontSize: `${size}px` }}>
                {name}
            </Link>
        </div>
    );
};

export default SideNav;

