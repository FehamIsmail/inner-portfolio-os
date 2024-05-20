import {ApplicationType} from "@/constants/types";
import MyPortfolio from "@/components/applications/MyPortfolio";

export const APPLICATIONS: ApplicationType[] = [
    {
        key: 'myPortfolio',
        name: 'My Portfolio',
        icon: 'myPortfolioClosed',
        width: 800,
        titleBarColor: 'blue',
        component: MyPortfolio
    },
    {
        key: 'myPortfolioOpened',
        name: 'My Portfolio Opened',
        icon: 'myPortfolioOpened',
        titleBarColor: 'red',
        component: MyPortfolio
    },
    {
        key: 'test',
        name: 'Test',
        icon: 'start',
        titleBarColor: 'yellow',
        component: MyPortfolio
    },
    {
        key: 'test2',
        name: 'Test2',
        icon: 'start',
        titleBarColor: 'green',
        component: MyPortfolio
    },
];