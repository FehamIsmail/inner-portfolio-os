import React from "react";

interface PortfolioContentProps {
  title: string;
  children: React.ReactNode;
}
const PortfolioContent = (props: PortfolioContentProps) => {
  const { children, title } = props;

  return (
    <div className={"flex flex-col bg-retro-white lg:bg-retro-medium min-h-full min-w-0"}>
      <div
        className={
          "flex-grow min-w-0 p-4 sm:p-6 lg:p-[48px] h-full border-x-0 lg:border-x-3 border-retro-dark bg-retro-white select-text lg:mr-[100px]"
        }
      >
        <h1 className="lg:-ml-[3px] mb-2 lg:-mb-12 break-words">{title}</h1>
        <div
          className={
            "font-pixolde font-extrabold text-[1.125rem] sm:text-[20px] lg:text-2xl min-w-0 [&_p]:text-[length:inherit] [&_li]:text-[length:inherit] [&_a]:text-[length:inherit]"
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default PortfolioContent;
