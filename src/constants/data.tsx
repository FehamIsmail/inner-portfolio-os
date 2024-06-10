import {ApplicationType} from "@/constants/types";
import MyPortfolio from "@/components/applications/MyPortfolio";
import ChatWithMe from "@/components/applications/ChatWithMe";
import DosPlayer from "@/components/os/DosPlayer";

const bundlePrefix = 'js-dos-bundles';
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
        width: 500,
        icon: 'robot',
        titleBarColor: 'blue',
        resizable: false,
        component: ChatWithMe
    },
    {
        key: 'doom',
        name: 'DOOM',
        icon: 'robot',
        width: 640,
        height: 400,
        titleBarColor: 'blue',
        component: DosPlayer,
        props: {
            width: 640,
            height: 400,
            bundleSrc: `doom.jsdoss`
        }
    }
];