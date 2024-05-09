import React from 'react';

import battery from './battery.png'
import close from './close.png'
import maximize from './maximize.png'
import minimize from './minimize.png'
import networkTabs from './network-tabs.png'
import restoreDown from './restore-down.png'
import speaker from './speaker.png'
import start from './start.png'
import wifi from './wifi.png'

const icons = {
    battery,
    close,
    maximize,
    minimize,
    networkTabs,
    restoreDown,
    speaker,
    start,
    wifi
}

export type IconName = keyof typeof icons;

const getIcon = (name: IconName) => icons[name];

export default getIcon;