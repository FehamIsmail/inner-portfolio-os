import React, {forwardRef} from 'react';
import Link from "next/link";

interface MyPortfolioProps {
    children: React.ReactNode;
}

const MyPortfolio = forwardRef<HTMLDivElement, MyPortfolioProps>((props, ref) => {
    return (
        <div className={"h-[500px] w-full bg-indigo-700 bg-opacity-30"}
             ref={ref}>
        <nav className={"flex flex-col"}>
            <Link href={"/"}>HOME</Link>
            <Link href={"/about"}>ABOUT</Link>
            <Link href={"/contact"}>CONTACT</Link>
        </nav>
        <div id={"portfolio-content"} />
            {props.children}
        </div>
    );

})

MyPortfolio.displayName = 'MyPortfolio';

export default MyPortfolio;