import React from 'react';
import Projects from "@/components/portfolio/pages/Projects";
import PortfolioContent from "@/components/portfolio/PortfolioContent";

const Page = () => {
    return (
        <PortfolioContent title={"Projects"}>
            <Projects />
        </PortfolioContent>
    );
};

export default Page;