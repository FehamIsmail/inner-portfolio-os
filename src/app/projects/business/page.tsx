import React from "react";
import PortfolioContent from "@/components/portfolio/PortfolioContent";
import Business from "@/components/portfolio/pages/Business";

const Page = () => {
  return (
    <PortfolioContent title={"Entrepreneurship"}>
      <Business />
    </PortfolioContent>
  );
};

export default Page;
