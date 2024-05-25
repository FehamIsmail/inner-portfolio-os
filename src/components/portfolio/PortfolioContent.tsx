import React from 'react';

interface PortfolioContentProps {
    title: string,
    children: React.ReactNode;
}
const PortfolioContent = (props: PortfolioContentProps) => {
    const { children, title } = props;

    return (
        <div className={"bg-retro-medium min-h-full"}>
            <div className={"ml-[250px] p-[48px] h-full border-x-3 border-retro-dark bg-retro-white select-text mr-[100px]"}>
                <h1 className={`-ml-[3px] -mb-12 `}>{title}</h1>
                <div className={"font-pixolde font-extrabold text-[20px]"}>{children}</div>
            </div>
        </div>
    );
};

export default PortfolioContent;