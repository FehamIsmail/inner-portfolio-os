import React from 'react';
import Experiences from "@/components/portfolio/pages/Experiences";
import PortfolioContent from "@/components/portfolio/PortfolioContent";

const Page = () => {
    return (
        <>
            <PortfolioContent title={"Experiences"}>
                <Experiences />
            </PortfolioContent>
        </>
    );
};

export default Page;