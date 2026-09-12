"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/common/Icon";
import { usePortfolioWindow } from "@/components/portfolio/PortfolioWindowContext";

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
  const { useMobileNav, dockSidebar } = usePortfolioWindow();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDesktopPanelOpen, setIsDesktopPanelOpen] = useState(false);
  const drawerRef = useRef<HTMLElement>(null);
  const desktopPanelRef = useRef<HTMLElement>(null);
  const isHome = navigation === "/";
  const expandProjects = navigation.startsWith("/projects");
  const navOnFocus = navigation.split("/").filter(Boolean).at(-1) || "home";
  const currentPageTitle =
    [...projectsLinks, ...navigationLinks].find((link) => link.href === navigation)
      ?.name ?? "Portfolio";

  const showMobileChrome = useMobileNav && !isHome;
  // Full expanded sidebar (wide window)
  const showFullSidebar = dockSidebar && !isHome;
  // Collapsed rail — arrow only (narrow window). User calls this "docked".
  const showDesktopRail = !useMobileNav && !dockSidebar && !isHome;

  useEffect(() => {
    setIsDrawerOpen(false);
    setIsDesktopPanelOpen(false);
  }, [navigation]);

  useEffect(() => {
    setIsDesktopPanelOpen(false);
  }, [dockSidebar]);

  useEffect(() => {
    if (!isDrawerOpen && !isDesktopPanelOpen) return;
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
        setIsDesktopPanelOpen(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    const focusRoot = isDrawerOpen ? drawerRef.current : desktopPanelRef.current;
    focusRoot?.querySelector<HTMLAnchorElement>("a")?.focus();
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isDrawerOpen, isDesktopPanelOpen]);

  const navigationContent = (
    onNavigate?: () => void,
    layout: "compact" | "full" = "compact",
  ) => (
    <>
      <div
        className={`text-4xl font-nevrada ${
          layout === "full" ? "px-8 pt-8 pb-6" : "p-6"
        }`}
      >
        <h2 className="font-[600] -mb-4">Ismail</h2>
        <h2 className="font-[900] -mb-8">Feham</h2>
        <h4 className="font-nunito text-[20px] font-[700]">My Portfolio</h4>
      </div>
      <nav
        aria-label="Portfolio navigation"
        className={`flex flex-col font-pixolde gap-2 font-[800] text-xl overflow-y-auto ${
          layout === "full" ? "px-8 pr-6 pb-8 pt-4" : "p-6 pr-3"
        }`}
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
      {/* Mobile / tablet viewport: floating top bar + drawer */}
      {showMobileChrome && (
        <header className="absolute top-2 md:top-5 left-2 right-2 md:left-3 md:right-3 z-30 h-12 border-3 border-retro-dark rounded-md shadow-figure flex items-stretch overflow-hidden">
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

      {showMobileChrome && isDrawerOpen && (
        <div className="absolute inset-0 z-40 flex">
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
              {navigationContent(() => setIsDrawerOpen(false), "compact")}
            </div>
          </aside>
        </div>
      )}

      {/* Collapsed rail (narrow window): pill — full-width top button strip */}
      {showDesktopRail && (
        <aside className="relative z-20 flex flex-col w-12 shrink-0 h-full border-r-3 border-retro-dark bg-retro-medium">
          <button
            type="button"
            aria-label={isDesktopPanelOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isDesktopPanelOpen}
            aria-controls="portfolio-desktop-navigation"
            className="h-11 w-full shrink-0 border-b-3 border-retro-dark bg-retro-white flex items-center justify-center hover:bg-retro-medium-dark"
            onClick={() => setIsDesktopPanelOpen((open) => !open)}
          >
            <Icon
              icon={isDesktopPanelOpen ? "arrowLeft" : "arrowRight"}
              size={16}
              colorize={true}
            />
          </button>
        </aside>
      )}

      {/* Flyout panel (rail expanded): split header — empty left | control */}
      {showDesktopRail && isDesktopPanelOpen && (
        <div className="absolute inset-0 z-40 flex">
          <aside
            id="portfolio-desktop-navigation"
            ref={desktopPanelRef}
            className="relative z-10 flex h-full w-[250px] flex-col overflow-hidden border-r-3 border-retro-dark bg-retro-white"
          >
            <div className="flex h-11 shrink-0 border-b-3 border-retro-dark overflow-hidden">
              <div className="flex-1 min-w-0 bg-retro-medium" />
              <button
                type="button"
                aria-label="Collapse navigation"
                className="w-11 shrink-0 border-l-3 border-retro-dark bg-retro-white flex items-center justify-center hover:bg-retro-medium-dark"
                onClick={() => setIsDesktopPanelOpen(false)}
              >
                <Icon icon="arrowLeft" size={16} colorize={true} />
              </button>
            </div>
            <div className="flex h-full min-h-0 flex-col divide-y-3 divide-retro-dark overflow-hidden">
              {navigationContent(() => setIsDesktopPanelOpen(false), "compact")}
            </div>
          </aside>
          <button
            type="button"
            aria-label="Close navigation"
            className="flex-1 bg-retro-dark/25"
            onClick={() => setIsDesktopPanelOpen(false)}
          />
        </div>
      )}

      {/* Full sidebar (wide window) */}
      {showFullSidebar && (
        <aside className="flex flex-col w-[250px] shrink-0 h-full overflow-hidden border-r-3 border-retro-dark divide-y-3 divide-retro-dark bg-retro-white">
          {navigationContent(undefined, "full")}
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
