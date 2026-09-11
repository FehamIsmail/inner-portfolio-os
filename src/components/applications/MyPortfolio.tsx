"use client";

import React, { forwardRef } from "react";
import { usePathname } from "next/navigation";
import SideNav from "@/components/portfolio/SideNav";

interface MyPortfolioProps {
  children: React.ReactNode;
}

const MyPortfolio = forwardRef<HTMLDivElement, MyPortfolioProps>(
  (props, ref) => {
    const pathname = usePathname();
    const isHome = pathname === "/";

    return (
      <div
        className={
          "flex flex-1 min-w-0 min-h-0 relative text-retro-dark font-bold bg-retro-white bg-opacity-30"
        }
        ref={ref}
      >
        <div
          className={
            "flex flex-row portfolio-content-wrapper w-full h-full min-w-0 min-h-0 overflow-hidden"
          }
        >
          <SideNav />
          <div
            id={"portfolio-content"}
            className={`flex-1 min-w-0 min-h-0 h-full overflow-y-auto overflow-x-hidden [&>*]:min-h-full ${
              isHome ? "pt-0" : "pt-[4.25rem] md:pt-24 lg:pt-0"
            }`}
          >
            {props.children}
          </div>
        </div>
      </div>
    );
  },
);

MyPortfolio.displayName = "MyPortfolio";

export default MyPortfolio;
