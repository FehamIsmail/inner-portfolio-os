import React from 'react';
import Icon from "@/components/common/Icon";


function MyPortfolio() {
    const myPortfolioRef = React.useRef<HTMLDivElement>(null);

    return (
        <div ref={myPortfolioRef} className={"h-[500px] w-[650px] flex flex-col gap-10 bg-indigo-700 bg-opacity-30"}>
            {myPortfolioRef.current?.getBoundingClientRect().width.toFixed(2)}{' \n'}
            {myPortfolioRef.current?.getBoundingClientRect().height.toFixed(2)}
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <div><Icon icon={'networkTabs'} size={90}/> </div>

        </div>
    );
}

export default MyPortfolio;