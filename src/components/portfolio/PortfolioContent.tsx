import React from 'react';
import {TITLE_HEIGHT} from "@/components/applications/MyPortfolio";

interface PortfolioContentProps {
    title: string,
    children: React.ReactNode;
}
const PortfolioContent = (props: PortfolioContentProps) => {
    const { children, title } = props;

    return (
        <div className={"font-millennium ml-[250px] p-[48px]"}>
            <h1 className={`${TITLE_HEIGHT.className}`}>{title}</h1>
            {children}
        </div>
    );
};

export default PortfolioContent;