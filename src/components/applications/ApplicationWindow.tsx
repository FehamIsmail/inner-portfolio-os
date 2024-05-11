import React from 'react';

interface ApplicationWindowProps {
    onClose: () => void;
    onMinimize: () => void;
    onMaximize: () => void;
    name: string;
    icon: string;
    component: React.ReactElement;
}

function ApplicationWindow(props: ApplicationWindowProps) {
    return (
        <div>

        </div>
    );
}

export default ApplicationWindow;