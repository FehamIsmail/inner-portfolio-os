import battery from './battery.png'
import close from './close.png'
import maximize from './maximize.png'
import minimize from './minimize.png'
import myPortfolioClosed from './myPortfolioClosed.svg'
import myPortfolioOpened  from './myPortfolioOpened.svg'
import networkTabs from './networkTabs.png'
import resize from './resize.png'
import restoreDown from './restoreDown.png'
import speaker from './speaker.svg'
import start from './start.png'
import wifi from './wifi.png'

const icons = {
    battery,
    close,
    maximize,
    minimize,
    myPortfolioClosed,
    myPortfolioOpened,
    networkTabs,
    resize,
    restoreDown,
    speaker,
    start,
    wifi
}

export type IconName = keyof typeof icons;

const getIcon = (name: IconName) => icons[name];

export default getIcon;