import React from 'react';
import mailbox from "@/assets/resources/mailbox.gif";
import download from "@/assets/resources/down.png";
import Image from "next/image";

interface ResumeDownloadProps {
    margin: number;

}
const ResumeDownload = ({margin}: ResumeDownloadProps) => {
    return (
        <div className={"border-retro-dark border-y-2 mt-7"}
            style={{
                marginLeft: `-${margin}px`,
                marginRight: `-${margin}px`,
            }}
        >
            <div className={"px-12 py-2 flex flex-row items-center gap-3"}>
                <div className={"h-20 w-16 flex items-center"}>
                    <Image
                        src={mailbox.src}
                        className={"mb-2 w-auto"}
                        style={{imageRendering: 'pixelated'}}
                        width={100}
                        height={100}
                        layout={'responsive'}
                        alt={'mailbox'}
                    />
                </div>
                <div className={"flex flex-col gap-0 -mt-[5px] center"}>
                    <h4 className={"mt-0"}>Searching for my resume?</h4>
                    <a className={"-mt-3 flex flex-row w-fit gap-2 items-center"} href={''}>
                        Download it here!
                        <Image className={"-mt-[2px]"} src={download.src} width={24} height={14} alt={'download'}/>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ResumeDownload;