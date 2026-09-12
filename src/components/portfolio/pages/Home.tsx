import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div
      className={
        "select-text h-full min-h-full flex flex-col items-center w-full bg-retro-medium px-2.5 py-2.5 lg:px-0 lg:py-0"
      }
    >
      <div
        className={
          "flex flex-col items-center justify-between h-full min-h-0 flex-1 w-full max-w-[1280px] lg:w-[62%] border-3 lg:border-y-0 lg:border-x-3 border-retro-dark bg-retro-white rounded-lg lg:rounded-none shadow-figure lg:shadow-none overflow-hidden"
        }
      >
        <div
          className={
            "flex flex-col items-center pt-5 pb-6 lg:py-12 border-b-3 border-retro-dark w-full text-center bg-retro-medium px-4 sm:px-8 lg:bg-retro-white lg:border-b-0"
          }
        >
          <div className={"w-fit"}>
            <h3 className={"mt-0"}>My Portfolio</h3>
            <div
              className={"w-full h-[2px] rounded-full bg-retro-dark -mt-[3px]"}
            ></div>
          </div>
          <p className={"!mt-2 max-w-2xl font-medium text-[16px] text-center text-retro-dark"}>
            Welcome to my Portfolio! Here you can find all the information about
            me and my projects.
          </p>
        </div>

        <div className="w-full px-4 sm:px-8 pt-7 lg:pt-0 flex-1 flex flex-col justify-center">
          <div className={"flex mb-8 lg:mb-[60px] flex-col items-center text-center"}>
            <h1 className={"font-extrabold leading-tight"}>Ismail Feham</h1>
            <h2 className={"mt-1 lg:mt-2 mb-1 lg:mb-3 text-2xl lg:text-[31px] font-pixolde font-bold"}>
              Software Engineer
            </h2>
            <h4 className={"mt-0 text-lg lg:text-[24px] font-pixolde font-bold"}>
              Previously at Coinbase
            </h4>
          </div>
          <nav className={"grid grid-cols-2 lg:flex lg:flex-wrap lg:justify-center gap-2.5 lg:gap-2 text-2xl lg:text-[34px] font-pixolde pb-6 lg:pb-[60px] text-center"}>
            <Link
              href={"/about"}
              className="p-3 lg:p-4 visited:text-purple-950 border-3 border-retro-dark bg-retro-white active:bg-retro-medium-dark rounded-md lg:rounded-none shadow-figure no-underline lg:border-0 lg:bg-transparent lg:shadow-none lg:underline lg:active:bg-transparent"
            >
              About
            </Link>
            <Link
              href={"/experiences"}
              className="p-3 lg:p-4 visited:text-purple-950 border-3 border-retro-dark bg-retro-white active:bg-retro-medium-dark rounded-md lg:rounded-none shadow-figure no-underline lg:border-0 lg:bg-transparent lg:shadow-none lg:underline lg:active:bg-transparent"
            >
              Experiences
            </Link>
            <Link
              href={"/projects"}
              className="p-3 lg:p-4 visited:text-purple-950 border-3 border-retro-dark bg-retro-white active:bg-retro-medium-dark rounded-md lg:rounded-none shadow-figure no-underline lg:border-0 lg:bg-transparent lg:shadow-none lg:underline lg:active:bg-transparent"
            >
              Projects
            </Link>
            <Link
              href={"/contact"}
              className="p-3 lg:p-4 visited:text-purple-950 border-3 border-retro-dark bg-retro-white active:bg-retro-medium-dark rounded-md lg:rounded-none shadow-figure no-underline lg:border-0 lg:bg-transparent lg:shadow-none lg:underline lg:active:bg-transparent"
            >
              Contact
            </Link>
          </nav>
        </div>
        <div
          className={
            "w-full shrink-0 border-t-3 border-retro-dark bg-retro-medium h-10 lg:h-[127px] lg:border-t-0 lg:bg-transparent"
          }
        />
      </div>
    </div>
  );
};

export default Home;
