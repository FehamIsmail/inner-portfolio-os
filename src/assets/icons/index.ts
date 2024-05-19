import arrowUp from './arrowUp.svg'
import arrowDown from './arrowDown.svg'
import battery from './battery.svg'
import close from './close.png'
import maximize from './maximize.png'
import minimize from './minimize.png'
import myPortfolioClosed from './myPortfolioClosed.svg'
import myPortfolioOpened  from './myPortfolioOpened.svg'
import networkTabs from './networkTabs.png'
import resize from './resize.svg'
import restoreDown from './restoreDown.png'
import speaker from './speaker.svg'
import start from './start.png'
import wifi1 from './wifi1.svg'
import wifi2 from './wifi2.svg'
import wifi3 from './wifi3.svg'

const icons = {
    arrowUp,
    arrowDown,
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
    wifi1,
    wifi2,
    wifi3,
}

export type IconName = keyof typeof icons;

const getIcon = (name: IconName) => icons[name];

export default getIcon;