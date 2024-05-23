import React from 'react';
import mailbox from "@/assets/images/mailbox.gif";
import download from "@/assets/images/down.png";
import Image from "next/image";

interface ResumeDownloadProps {
    margin: number;

}
const ResumeDownload = ({margin}: ResumeDownloadProps) => {
    return (
        <div className={"border-retro-dark border-y-2 mt-4"}
            style={{
                marginLeft: `-${margin}px`,
                marginRight: `-${margin}px`,
            }}
        >
            <div className={"px-12 py-4 flex flex-row gap-3"}>
                <Image
                    src={mailbox.src}
                    className={"mb-2"}
                    width={61}
                    height={61}
                    style={{imageRendering: 'pixelated'}}
                    alt={'mailbox'}/>
                <div className={"flex flex-col gap-1 justify-center"}>
                    <h4 className={""}>Interested in my resume?</h4>
                    <a className={"flex flex-row gap-2 items-center"} href={''}>Download it here!
                        <Image src={download.src} width={24} height={14} alt={'download'}/>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ResumeDownload;