"use client";

import { ApplicationType } from "@/constants/types";
import MyPortfolio from "@/components/applications/MyPortfolio";
import dynamic from "next/dynamic";

const AppLoading = () => <div className="w-full h-full min-h-[160px] bg-retro-white" />;

const ChatWithMe = dynamic(
  () => import("@/components/applications/ChatWithMe"),
  { ssr: false, loading: AppLoading },
);
const GamePlayer = dynamic(() => import("@/components/os/GamePlayer"), {
  ssr: false,
  loading: AppLoading,
});
const ReadMe = dynamic(() => import("@/components/applications/ReadMe"), {
  ssr: false,
  loading: AppLoading,
});

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
    height: 520,
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
    hideOnMobile: true,
    component: ReadMe,
  },
  {
    key: "doom",
    name: "DOOM",
    icon: "doom",
    titleBarColor: "red",
    width: 800,
    height: 600,
    hideOnMobile: true,
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
    hideOnMobile: true,
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
    hideOnMobile: true,
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
    hideOnMobile: true,
    component: GamePlayer,
    props: {
      gameSrc: `https://emupedia.net/emupedia-game-space-cadet-pinball/`,
    },
  },
];
