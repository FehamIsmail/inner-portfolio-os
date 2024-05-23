import React from 'react';
import Experiences from "@/components/portfolio/Experiences";
import PortfolioContent from "@/components/portfolio/PortfolioContent";
import ResumeDownload from "@/components/portfolio/ResumeDownload";

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