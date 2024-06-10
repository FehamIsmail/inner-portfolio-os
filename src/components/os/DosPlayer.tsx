import React, {forwardRef, useEffect, useRef, useState} from "react";
import {DosPlayer as Instance, DosPlayerFactoryType} from "js-dos";
import {DosOptions} from "emulators-ui/dist/types/js-dos";

declare const Dos: DosPlayerFactoryType;

interface PlayerProps {
    width: number;
    height: number;
    bundleUrl: string;
}

const DosPlayer = forwardRef<HTMLDivElement, PlayerProps>((props, ref) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const { width, height, bundleUrl = '/js-dos-bundles/persia.jsdos' } = props;
    const [dos, setDos] = useState<Instance | null>(null);

    useEffect(() => {
        if (rootRef === null || rootRef.current === null) {
            return;
        }

        const root = rootRef.current as HTMLDivElement;
        const instance = Dos(root);

        setDos(instance);
        const elements = rootRef.current.getElementsByClassName('flex-grow-0');

        while (elements.length > 0) {
            elements[0].remove();
        }

        return () => {
            instance.stop();
        };
    }, [rootRef]);

    useEffect(() => {
        if (dos !== null) {
            dos.run(bundleUrl);
        }
    }, [dos, bundleUrl]);

    return (
        <div ref={ref}>
        <div
            ref={rootRef}
            style={{
                width: props.width,
                height: props.height,
                position: 'absolute',
            }}
        />
        </div>
    );
});

DosPlayer.displayName = "DosPlayer";

export default DosPlayer;
