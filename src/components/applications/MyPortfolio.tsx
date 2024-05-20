import React, {forwardRef} from 'react';
import Icon from "@/components/common/Icon";

const MyPortfolio = forwardRef<HTMLDivElement>((_, ref) => {
    return (
        <div className={"h-[500px] w-full flex flex-row gap-10 bg-indigo-700 bg-opacity-30"}
             ref={ref}
        >
            <div><Icon icon={'networkTabs'} size={90}/> </div>
            <div><Icon icon={'networkTabs'} size={90}/> </div>
            <div><Icon icon={'networkTabs'} size={90}/> </div>
            <div><Icon icon={'networkTabs'} size={90}/> </div>
            <div><Icon icon={'networkTabs'} size={90}/> </div>
            <div><Icon icon={'networkTabs'} size={90}/> </div>
        </div>
    );
})

MyPortfolio.displayName = 'MyPortfolio';

export default MyPortfolio;