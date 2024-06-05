import {ApplicationType} from "@/constants/types";
import MyPortfolio from "@/components/applications/MyPortfolio";
import ChatWithMe from "@/components/applications/ChatWithMe";

export const APPLICATIONS: ApplicationType[] = [
    {
        key: 'myPortfolio',
        name: 'My Portfolio',
        icon: 'myPortfolioClosed',
        width: 1000,
        height: 800,
        titleBarColor: 'red',
        component: MyPortfolio
    },
    {
        key: 'chatWithMe',
        name: 'Chat with me',
        icon: 'robot',
        titleBarColor: 'blue',
        resizable: false,
        component: ChatWithMe
    }
];