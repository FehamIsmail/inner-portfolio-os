import React from "react";
import PortfolioContent from "@/components/portfolio/PortfolioContent";
import Software from "@/components/portfolio/pages/Software";

const Page = () => {
  return (
    <PortfolioContent title={"Software"}>
      <Software />
    </PortfolioContent>
  );
};

export default Page;
