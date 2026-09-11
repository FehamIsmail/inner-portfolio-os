import React from "react";
import mailbox from "@/assets/images/mailbox.gif";
import download from "@/assets/images/down.png";
import Image from "next/image";

interface ResumeDownloadProps {
  margin: number;
}
const ResumeDownload = ({ margin }: ResumeDownloadProps) => {
  return (
    <div
      className={"resume-download border-retro-dark border-y-2 mt-7"}
      style={
        { "--resume-margin": `${margin}px` } as React.CSSProperties
      }
    >
      <div className={"px-3 sm:px-12 py-3.5 sm:py-2 flex flex-row items-center justify-center sm:justify-start"}>
        <div className={"flex flex-row items-center gap-3 text-left"}>
          <div className={"h-12 w-12 sm:h-20 sm:w-16 flex items-center justify-center shrink-0"}>
            <Image
              src={mailbox.src}
              className={"mb-0 sm:mb-2 w-auto"}
              style={{ imageRendering: "pixelated" }}
              width={100}
              height={100}
              layout={"responsive"}
              alt={"mailbox"}
            />
          </div>
          <div className={"flex min-w-0 flex-col gap-0 items-start text-left sm:-mt-[5px]"}>
            <h4 className={"mt-0 text-left text-[20px] sm:text-[34px] leading-tight"}>
              Searching for my resume?
            </h4>
            <a
              className={"mt-0 sm:-mt-3 flex flex-row flex-wrap justify-start w-fit gap-2 items-center text-sm sm:text-inherit"}
              rel="noopener noreferrer"
              target="_blank"
              href={"/resume/ismail_feham_resume.pdf"}
            >
              Download it here!
              <Image
                className={"-mt-[2px]"}
                src={download.src}
                width={24}
                height={14}
                alt={"download"}
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeDownload;
