import alert from './alert.svg'
import arrowDown from './arrowDown.svg'
import arrowUp from './arrowUp.svg'
import arrowLeft from './arrowLeft.svg'
import arrowRight from './arrowRight.svg'
import battery from './battery.svg'
import close from './close.svg'
import error from './error.svg'
import maximize from './maximize.svg'
import minimize from './minimize.svg'
import myPortfolioClosed from './myPortfolioClosed.svg'
import myPortfolioOpened  from './myPortfolioOpened.svg'
import networkTabs from './networkTabs.png'
import resize from './resize.svg'
import restoreDown from './restoreDown.svg'
import speaker from './speaker.svg'
import start from './start.png'
import success from './success.svg'
import wifi1 from './wifi1.svg'
import wifi2 from './wifi2.svg'
import wifi3 from './wifi3.svg'

const icons = {
    alert,
    arrowUp,
    arrowDown,
    arrowLeft,
    arrowRight,
    battery,
    close,
    error,
    maximize,
    minimize,
    myPortfolioClosed,
    myPortfolioOpened,
    networkTabs,
    resize,
    restoreDown,
    speaker,
    start,
    success,
    wifi1,
    wifi2,
    wifi3,
}

export type IconName = keyof typeof icons;

const getIcon = (name: IconName) => icons[name];

export default getIcon;