import React from 'react';
import About from "@/components/portfolio/About";
import PortfolioContent from "@/components/portfolio/PortfolioContent";

const Page = () => {
    return (
        <PortfolioContent title={"Hello,"}>
            <About />
        </PortfolioContent>
    );
};

export default Page;