import React from 'react';
import {TITLE_HEIGHT} from "@/components/applications/MyPortfolio";

interface PortfolioContentProps {
    title: string,
    children: React.ReactNode;
}
const PortfolioContent = (props: PortfolioContentProps) => {
    const { children, title } = props;

    return (
        <div className={"bg-retro-medium min-h-full"}>
            <div className={"ml-[250px] p-[48px] h-full border-l-3 border-retro-dark bg-retro-white"}>
                <h1 className={`${TITLE_HEIGHT.className} -ml-[3px] `}>{title}</h1>
                {children}
            </div>
        </div>
    );
};

export default PortfolioContent;