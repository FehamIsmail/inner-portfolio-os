import React from 'react';
import ImageExplorer from "@/components/common/ImageExplorer";
import horse_skull_reference from "@/assets/images/projects/arts/horse_skull_reference.png";
import horse_skull_drawing from "@/assets/images/projects/arts/horse_skull_drawing.png";
import MediaCaption from "@/components/portfolio/MediaCaption";
import Link from "next/link";

const Arts = () => {
    return (
        <div>
            <h2>From stencils to pixels</h2>
            <p>
                I&apos;ve always been fascinated by arts and crafts. I enjoy creating intricate designs and patterns
                using various mediums, from paper to digital tools. I find the process of creating art to be both
                therapeutic and rewarding, allowing me to express myself in unique and creative ways. Over the years,
                I&apos;ve
                experimented with different art forms, including painting, drawing, and digital art.
            </p>
            <h3>Classical drawing</h3>
            <p>
                In high school, we were asked to draw a an animal skull from a variety of angles. I chose a horse skull
                as
                my subject and spent hours studying its structure and details. This project&nbsp;s goal was to help us
                understand the importance of observation and attention to detail in art. More specifically, we learned
                how
                to apply <b>sighting</b>, a technique used to measure and compare proportions, angles, and distances in
                a
                subject.
            </p>
            <div className={"mt-4 mx-auto w-fit max-w-full overflow-clip"}>
                <ImageExplorer
                    className={"bg-retro-medium-dark"}
                    height={500}
                    width={700}
                    images={[
                        {name: "horse skull drawing", src: horse_skull_drawing.src},
                        {name: "horse skull reference", src: horse_skull_reference.src},
                    ]}/>
            </div>
            <p>
                I&apos;m very proud of the final result. I think it&apos;s a testament of my learning and growth as
                someone
                who enjoys creating art. I am particularly proud of the <b>shading</b> and the&nbsp;<b>attention to
                detail</b>
                &nbsp;I put into the skull&apos;s structure. I believe that this project helped me improve my
                observational skills
                and my ability to translate what I see onto paper.
            </p>
            <h3>Pixel Art</h3>
            <p>
                When I was younger, I used to play a lot of video games. I was always fascinated by the art style of
                classic
                games like Minecraft. I loved the simplicity and charm of pixel art, and I wanted to try my hand at
                creating
                my own pixel art characters and scenes. Developing&nbsp;<Link href={'/projects/software'}><b>GunRunner</b></Link>
                &nbsp;was a great opportunity for me to experiment with pixel art and learn more about the process of creating
                sprites and animations. I enjoyed the challenge of working with limited colors and pixels to create.
            </p>

            <div className={"mt-4 w-full h-fit flex flex-row justify-center gap-10 items-center"}>
            <MediaCaption   src={"/videos/arts/monster_idle.mp4"}
                            type={"video"}
                            width={300}
                            alt={"Monster idle animation"}
                            caption={"Monster idle animation"}
                            count={1}
            />

            <MediaCaption   className={"flex-1"}
                            src={"/videos/arts/monster_death.mp4"}
                            type={"video"}
                            width={300}
                            alt={"Monster death animation"}
                            caption={"Monster death animation"}
                            count={2}
            />
        </div>
    </div>
)};

export default Arts;