import {ApplicationType} from "@/constants/types";
import MyPortfolio from "@/components/applications/MyPortfolio";
import Test from "@/components/applications/Test";

// Applications as a list of ApplicationType objects
export const APPLICATIONS: ApplicationType[] = [
    {
        key: 'myPortfolio',
        name: 'My Portfolio',
        icon: 'myPortfolioClosed',
        titleBarColor: 'blue',
        component: MyPortfolio,
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
        component: Test
    },
    {
        key: 'test2',
        name: 'Test2',
        icon: 'start',
        titleBarColor: 'green',
        component: Test
    }
];