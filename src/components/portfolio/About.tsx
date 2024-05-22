import React from 'react';
import mailbox from '@/assets/images/mailbox.gif';
import Link from "next/link";

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
                &nbsp;as a Full Stack Web Developer. I&apos;m also a third-year student at Concordia University,
                expected to graduate on May 2025.
            </p>
            <p>I&apos;m thrilled that you&apos;re taking the time to browse through my portfolio. It was a joy to put together,
                and I hope you find it just as engaging. Should you have any inquiries or feedback, don&apos;t hesitate to
                connect with me through <Link className={"visited:text-purple-950"} href="/contact"><b>this form</b></Link> or send an
                email to <a href="mailto:ismail.feham64@gmail.com"><b>ismail.feham64@gmail.com</b></a>.</p>
            <p className={"border-retro-dark border-y-2 -mx-12"}>
                <div className={"px-12 py-4 flex flex-row gap-2"}>
                    <img src={mailbox.src} className={"mb-2"} width={60} style={{imageRendering: 'pixelated'}}
                         alt={'mailbox'}/>
                    <div className={"flex flex-col justify-center"}>
                        <h4 className={""}>Interested in my resume?</h4>
                        <a className={""} href={''}>Download it here!</a>
                    </div>
                </div>
            </p>
            <h4 className={"mt-8"}>My Childhood</h4>
            <p>

                I have always been curious and enjoyed exploring how objects work, often finding great interest
                in reverse engineering complex mechanisms. This inquisitiveness led to my first programming experience
                with Lego Mindstorms in my later elementary school years, sparking a deep interest in robotics.
                In high school, I joined the school&apos;s robotics team, 3550 Robotronix. My curiosity drove me to
                experiment
                with various team divisions, including 3D modeling in AutoCAD, mechanics, electrical work, and
                eventually
                programming in Java.
            </p>
        </div>
    );
};

export default About;