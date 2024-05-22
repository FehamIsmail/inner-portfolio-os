import React from "react";
import Link from "next/link";

const Home = () => {
    return (
        <div className={'select-text h-full flex flex-col items-center w-full bg-retro-medium'}>
            <div
                className={"flex flex-col items-center justify-between h-full border-x-3 border-retro-dark bg-retro-white"}
                style={{
                    width: 'clamp(840px, 62%, 1280px)'
                }}
            >
                <div className={'flex flex-col items-center py-12 border-retro-dark w-full'}>
                    <div className={"w-fit"}>
                        <h1 className={"text-xl"}>My Portfolio</h1>
                        <div className={"w-full h-[2px] rounded-full bg-retro-dark -mt-[3px]"}></div>
                    </div>
                    <p className={"mt-3 font-medium text-md text-retro-dark"}>
                        Welcome to my Portfolio! Here you can find all the information about me and my projects.
                    </p>
                </div>

                <div>
                    <div className={"flex mb-[60px] flex-col items-center"}>
                        <h1 className={"text-[80px] font-extrabold"}>
                            Ismail Feham
                        </h1>
                        <h2 className={"-mt-6 text-[30px] font-bold"}>
                            Software Engineer COOP
                        </h2>
                        <h4 className={"text-[18px] font-bold"}>
                            Concordia University
                        </h4>
                    </div>
                    <nav className={"text-[30px] pb-[60px]"}>
                        <Link href={"/about"} className="p-4 visited:text-purple-950">
                            About
                        </Link>
                        <Link href={"/experiences"} className="p-4 visited:text-purple-950">
                            Experiences
                        </Link>
                        <Link href={"/projects"} className="p-4 visited:text-purple-950">
                            Projects
                        </Link>
                        <Link href={"/contact"} className="p-4 visited:text-purple-950">
                            Contact
                        </Link>
                    </nav>
                </div>
                <div className={"h-[127px]"}/>
            </div>
        </div>
    );
};

export default Home;