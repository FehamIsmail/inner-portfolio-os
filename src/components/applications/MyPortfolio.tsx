import React, { forwardRef } from "react";
import SideNav from "@/components/portfolio/SideNav";
interface MyPortfolioProps {
  children: React.ReactNode;
}

const MyPortfolio = forwardRef<HTMLDivElement, MyPortfolioProps>(
  (props, ref) => {
    return (
      <div
        className={
          "flex flex-1 relative text-retro-dark font-bold bg-retro-white bg-opacity-30"
        }
        ref={ref}
      >
        <div
          className={
            "flex flex-col portfolio-content-wrapper max-h-full absolute top-0 left-0 bottom-0 right-0"
          }
        >
          <SideNav />
          <div id={"portfolio-content"} className={"h-full"}>
            {props.children}
          </div>
        </div>
      </div>
    );
  },
);

MyPortfolio.displayName = "MyPortfolio";

export default MyPortfolio;
