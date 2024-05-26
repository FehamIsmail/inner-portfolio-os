import React from 'react';
import Link from "next/link";
import ResumeDownload from "@/components/portfolio/ResumeDownload";
import ImageCaption from "@/components/portfolio/ImageCaption";
import Image from "next/image";
import lego from "@/assets/images/lego_mindstorms.png";
import me_robotics from "@/assets/images/childhood_robotics.png";
import vanier_college from "@/assets/images/vanier_college.jpg";
import concordia from "@/assets/images/concordia.jpg";

const About = () => {
    return (
        <div>
            <h2 className={""}>I&apos;m Ismail Feham.</h2>
            <p>
                I&apos;m a Software Engineer undergraduate currently interning at&nbsp;
                <a href="https://www.flexspring.com/"
                   className={"visited:text-purple-950"}
                   target="_blank"
                   rel="noreferrer noopener"
                ><b>Flexspring</b></a>
                &nbsp;as a Full Stack Web Developer. I&apos;m a fourth-year student at Concordia University,
                expecting to graduate on May 2025.
            </p>
            <p>I&apos;m thrilled that you&apos;re taking the time to browse through my portfolio. It was a joy to put together,
                and I hope you find it just as engaging. Should you have any inquiries or feedback, don&apos;t hesitate to
                connect with me through <Link className={"visited:text-purple-950"} href="/src/components/portfolio/pages/Contact"><b>this form</b></Link> or send an
                email directly to <a href="mailto:ismail.feham64@gmail.com"><b>ismail.feham64@gmail.com</b></a>.</p>
            <ResumeDownload margin={20}/>

            {/****************** Childhood ***********************/}
            <h4 className={"mt-8"}>Growing up</h4>
            <p>
                I have always been curious and enjoyed exploring how objects work, often finding great interest
                in reverse engineering complex mechanisms. This inquisitiveness led to my first programming experience
                with<Image className={"inline px-2"} src={lego.src} height={18} width={140} alt={"Lego Mindstorms"}/>
                in my later elementary school years, sparking a deep interest in robotics.
                In high school, I joined the school&apos;s robotics team, 3550 Robotronix. My curiosity drove me to
                experiment
                with various team divisions, including 3D modeling in AutoCAD, mechanics, electrical work, and
                eventually
                programming in Java.
            </p>
            <div className={"px-64 mt-4 w-full h-fit flex flex-col items-center"}>
                <ImageCaption
                    src={me_robotics.src}
                    alt={""}
                    caption={"Photo of myself intensely focused on team strategies."}
                    count={1}
                />
            </div>
            {/****************** End of childhood ***********************/}


            {/**************** College years ***********************/}
            <div className={"mt-4 flex flex-row items-center gap-6"}>
                <div className={"flex-[3] mt-0 mb-14"}>
                    <h4>College years</h4>
                    <p className={""}>
                        My passion for robotics and programming led me to pursue a degree in Computer Science at Vanier
                        College in 2019. I was eager to learn more about software development and the underlying principles
                        of computer science. I was also interested in learning more about web development and how it could
                        be used to create engaging and interactive applications. I took on a variety of projects, including
                        developing a 2D platformer game <Link className={"visited:text-purple-950"} href={'/projects'}>
                        <b>Gun Runner</b></Link> built in Java using JavaFX for the graphics and physics engine. I&apos;ve
                        also worked on a physics simulation (<Link href={'/projects'} className={"visited:text-purple-950"}>
                        <b>EMS</b></Link>) project that simulates three laws of electromagnetism using Java and JavaFXML
                        by carefully following a project management plan.
                    </p>
                </div>
                <div className={"flex-1"}>
                    <ImageCaption
                        src={vanier_college.src}
                        alt={"Photo Vanier College"}
                        caption={"Vanier College"}
                        count={2}
                    />
                </div>
            </div>
            {/**************** End of college years ***********************/}


            {/**************** Concordia years ***********************/}
            <div className={"mt-4 flex flex-row items-center gap-6"}>
                <div className={"flex-1"}>
                    <ImageCaption
                        src={concordia.src}
                        alt={"Photo Concordia University"}
                        caption={"Concordia University"}
                        count={3}
                    />
                </div>
                <div className={"flex-[3] mt-0  mb-14"}>
                    <h4 className={"text-right"}>Undergrad years</h4>
                    <p className={""}>
                        I applied and transferred to Concordia University in 2021 to pursue a Bachelor&apos;s degree in
                        Software Engineering as a COOP student. It was my first choice and I was thrilled to be accepted.
                        Concordia&apos;s Software Engineering program developed in me a strong foundation in software
                        development, algorithms, and data structures. I&apos;ve also been exposed to various programming
                        languages, including C, C++, C#, Python, Lisp, and so on. As a COOP student, I&apos;ve had the
                        opportunity to work on real-world projects and gain valuable experience in my first internship
                        at <a href={"https://www.rossvideo.com/"} className={"visited:text-purple-950"} target="_blank" rel="noreferrer noopener">
                        <b>Ross Video</b></a> as a Full Stack Web Developer - and now at <a href={"https://www.flexspring.com/"}>
                        <b>Flexspring</b></a>.
                    </p>
                </div>
                {/**************** End of Concordia years ***********************/}

            </div>
        </div>
    );
};

export default About;