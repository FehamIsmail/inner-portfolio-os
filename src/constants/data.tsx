import { ApplicationType } from "@/constants/types";
import MyPortfolio from "@/components/applications/MyPortfolio";
import ChatWithMe from "@/components/applications/ChatWithMe";
import GamePlayer from "@/components/os/GamePlayer";
import ReadMe from "@/components/applications/ReadMe";

export const APPLICATIONS: ApplicationType[] = [
  {
    key: "myPortfolio",
    name: "My Portfolio",
    icon: "myPortfolioClosed",
    width: 1000,
    height: 800,
    titleBarColor: "red",
    component: MyPortfolio,
  },
  {
    key: "chatWithMe",
    name: "Chat with me",
    width: 500,
    icon: "robot",
    titleBarColor: "blue",
    resizable: false,
    component: ChatWithMe,
  },
  {
    key: "readme",
    name: "README.md",
    icon: "readme",
    titleBarColor: "blue",
    width: 1070,
    height: 400,
    resizable: false,
    component: ReadMe,
  },
  {
    key: "doom",
    name: "DOOM",
    icon: "doom",
    titleBarColor: "red",
    width: 800,
    height: 600,
    component: GamePlayer,
    props: {
      gameSrc: `https://emupedia.net/emupedia-game-doom1/`,
    },
  },
  {
    key: "persia",
    name: "Prince of Persia",
    icon: "persia",
    titleBarColor: "blue",
    width: 800,
    height: 600,
    component: GamePlayer,
    props: {
      gameSrc: `https://emupedia.net/emupedia-game-prince/`,
    },
  },
  {
    key: "minecraft",
    name: "Minecraft Alpha",
    icon: "minecraft",
    titleBarColor: "green",
    width: 800,
    height: 600,
    component: GamePlayer,
    props: {
      gameSrc: `https://emupedia.net/emupedia-game-minecraft-classic/`,
    },
  },
  {
    key: "pinball",
    name: "Space Cadet Pinball",
    icon: "pinball",
    titleBarColor: "blue",
    width: 800,
    height: 600,
    component: GamePlayer,
    props: {
      gameSrc: `https://emupedia.net/emupedia-game-space-cadet-pinball/`,
    },
  },
];
