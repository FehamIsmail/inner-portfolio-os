import React, {forwardRef} from 'react';
import SideNav from "@/components/portfolio/SideNav";
interface MyPortfolioProps {
    children: React.ReactNode;
}

export const TITLE_HEIGHT = {
    className: "font-vt323 text-[60px] font-extrabold",
    value: 60
}

const MyPortfolio = forwardRef<HTMLDivElement, MyPortfolioProps>((props, ref) => {

    return (
        <div
            className={"w-full text-retro-dark font-bold bg-retro-white overflow-hidden bg-opacity-30"}
             ref={ref}
        >
            <SideNav />
            <div id={"portfolio-content"} className={"h-full"}>
                {props.children}
            </div>
        </div>
    );

})

MyPortfolio.displayName = 'MyPortfolio';

export default MyPortfolio;