"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavigationLinkType {
  name: string;
  href: string;
}

const navigationLinks: NavigationLinkType[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Experiences", href: "/experiences" },
  { name: "Projects", href: "/projects" },
  { name: "Contact", href: "/contact" },
];

const projectsLinks: NavigationLinkType[] = [
  { name: "Software", href: "/projects/software" },
  { name: "Business", href: "/projects/business" },
  { name: "Arts", href: "/projects/arts" },
];

const SideNav = () => {
  const navigation = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const isHome = navigation === "/";
  const expandProjects = navigation.startsWith("/projects");
  const navOnFocus = navigation.split("/").filter(Boolean).at(-1) || "home";
  const currentPageTitle =
    [...projectsLinks, ...navigationLinks].find((link) => link.href === navigation)
      ?.name ?? "Portfolio";

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [navigation]);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsDrawerOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    drawerRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDrawerOpen]);

  const navigationContent = (onNavigate?: () => void) => (
    <>
      <div className="text-4xl font-nevrada p-6 lg:p-[48px]">
        <h2 className="font-[600] -mb-4">Ismail</h2>
        <h2 className="font-[900] -mb-8">Feham</h2>
        <h4 className="font-nunito text-[20px] font-[700]">My Portfolio</h4>
      </div>
      <nav
        aria-label="Portfolio navigation"
        className="flex flex-col font-pixolde gap-2 p-6 pr-3 lg:p-[48px] lg:pr-0 font-[800] text-xl overflow-y-auto"
      >
        {navigationLinks.map((link, index) => (
          <React.Fragment key={`nav-link-${index}`}>
            <CustomLink
              key={`component-link-${link.name}-${index}`}
              size={28}
              margin={10}
              name={link.name}
              href={link.href}
              isFocused={
                navOnFocus === link.name.toLowerCase() ||
                (link.name === "Projects" && expandProjects)
              }
              onNavigate={onNavigate}
            />
            {expandProjects && link.name === "Projects" && (
              <div
                className="flex flex-col gap-1 -mt-2 mb-1 ml-8"
                key={`expanded-nav-${index}`}
              >
                {projectsLinks.map((subLink, subIndex) => (
              <CustomLink
                    key={`sub-link-${subLink.name}-${subIndex}`}
                    margin={0}
                    size={26}
                    name={subLink.name}
                    href={subLink.href}
                    isFocused={navOnFocus === subLink.name.toLowerCase()}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>
    </>
  );

  return (
    <>
      {!isHome && (
        <header className="lg:hidden absolute top-2 md:top-5 left-2 right-2 md:left-3 md:right-3 z-30 h-12 border-3 border-retro-dark rounded-lg shadow-figure flex items-stretch overflow-hidden">
          <div className="font-nevrada font-light text-xl text-retro-dark flex-1 min-w-0 px-3 flex items-center pt-2 bg-retro-medium/65 backdrop-blur-md">
            <span className="">{currentPageTitle}</span>
          </div>
          <button
            type="button"
            aria-label="Open portfolio navigation"
            aria-expanded={isDrawerOpen}
            aria-controls="portfolio-mobile-navigation"
            className="w-12 shrink-0 border-l-3 border-retro-dark bg-retro-white/65 backdrop-blur-md flex flex-col items-center justify-center gap-[3px]"
            onClick={() => setIsDrawerOpen(true)}
          >
            <span className="w-4 h-[2px] bg-retro-dark" />
            <span className="w-4 h-[2px] bg-retro-dark" />
            <span className="w-4 h-[2px] bg-retro-dark" />
          </button>
        </header>
      )}

      {!isHome && isDrawerOpen && (
        <div className="lg:hidden absolute inset-0 z-40 flex">
          <button
            type="button"
            aria-label="Close portfolio navigation"
            className="absolute inset-0 bg-retro-dark/40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <aside
            id="portfolio-mobile-navigation"
            ref={drawerRef}
            className="relative z-10 flex h-full w-[min(82vw,320px)] flex-col overflow-hidden border-r-3 border-retro-dark bg-retro-white"
          >
            <button
              type="button"
              aria-label="Close portfolio navigation"
              className="absolute right-2 top-2 z-10 h-11 w-11 text-3xl leading-none"
              onClick={() => setIsDrawerOpen(false)}
            >
              ×
            </button>
            <div className="flex h-full min-h-0 flex-col divide-y-3 divide-retro-dark overflow-hidden">
              {navigationContent(() => setIsDrawerOpen(false))}
            </div>
          </aside>
        </div>
      )}

      {!isHome && (
        <aside className="hidden lg:flex flex-col w-[250px] shrink-0 h-full overflow-hidden divide-retro-dark divide-y-3 bg-retro-white">
          {navigationContent()}
        </aside>
      )}
    </>
  );
};

interface CustomLinkProps {
  name: string;
  href: string;
  size: number;
  margin: number;
  isFocused: boolean;
  onNavigate?: () => void;
}
const CustomLink = (props: CustomLinkProps) => {
  const { name, href, isFocused, size, margin, onNavigate } = props;
  return (
    <div
      className={"flex flex-row items-center gap-2"}
      style={{ marginBottom: `${margin}px` }}
    >
      {isFocused && <div className="w-2 h-2 bg-retro-dark rounded-full" />}
      <Link
        href={href}
        key={`link-${name}`}
        style={{ fontSize: `${size}px` }}
        onClick={onNavigate}
      >
        {name}
      </Link>
    </div>
  );
};

export default SideNav;
