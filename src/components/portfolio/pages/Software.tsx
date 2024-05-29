import React from 'react';
import ResumeDownload from "@/components/portfolio/ResumeDownload";
import github from "@/assets/images/github.png";
import Image from "next/image";
import MediaCaption from "@/components/portfolio/MediaCaption";
import portfolio from "@/assets/images/projects/software/portfolio.png";



const Software = () => {
    return (
        <div>
            <h2>Projects</h2>
            <ResumeDownload margin={20}/>

            {/****************** Website ***********************/}
            <h4 className={"flex flex-row justify-between items-center"}>
                Personal Website Custom OS
                <a  className={"flex text-3xl flex-row items-center gap-2"}
                    href={'https://github.com/FehamIsmail/inner-portfolio-os'} target="_blank" rel="noreferrer noopener">
                    <Image className={"mb-[2px]"} src={github.src} width={24} height={24} alt={"Github's Logo"} />
                    [GitHub]
                </a>
            </h4>
            <p>
                This website is a custom operating system that I built from scratch using <b>Next.js</b>, <b>Tailwind CSS
                </b>, and <b>TypeScript</b>. It is a project that I am very proud of, as it allowed me to experiment with
                various design concepts and implement them in a way that is both visually appealing and user-friendly.
                I wanted to create a unique experience for visitors to my portfolio. Originally, I had planned to use a
                more traditional design, but after experimenting with different layouts and color schemes, I decided to
                go with a retro-inspired look.
            </p>
            <p>
                I have created a <a href={"https://www.figma.com/design/mul003xLBGLIALAVfLifWd/Portfolio---Ismail-Feham?node-id=0-1&t=PPtJadM5PoLSVXy5-1"}
                                      target="_blank"
                                      rel="noreferrer noopener"
                                      className={"visited:text-purple-950"}>
                Figma</a> page to showcase the design of the website (Please be indulgent, I am not a Figma expert =] ).
                The design was inspired by the retro aesthetic of old-school operating systems, with a modern twist.
            </p>
            <MediaCaption className={"mt-4"}
                          src={portfolio.src}
                          alt={"Portfolio's Home Page"}
                          type={"image"}
                          caption={"Home Page of the Portfolio"}
                          count={1}
            />
            <p>
                One of the most challenging aspects of this project was implementing the animations and transitions that
                give the site its unique feel. I spent a lot of time experimenting with different techniques and libraries
                to achieve the desired effect. In the end, I settled on a library called <b>Framer Motion</b>, which allowed me
                to create complex animations with relative ease. After a lot of trial and error, I figured out that using
                Animation States would help me manage the animations more easily, avoiding superposition of animations.
            </p>
            {/****************** End of Website ****************/}



            {/****************** Console3D *********************/}
            <h4 className={"flex flex-row justify-between items-center"}>
                Console3D
                <a className={"flex text-3xl flex-row items-center gap-2"}
                   href={'https://github.com/FehamIsmail/Console3DGameEngine'} target="_blank" rel="noreferrer noopener">
                    <Image className={"mb-[2px]"} src={github.src} width={24} height={24} alt={"Github's Logo"}/>
                    [GitHub]
                </a>
            </h4>
            <p>
                This project is a custom-built 3D game engine, developed from scratch using a custom library called
                <b>oldConsoleGameEngine</b>. The engine is designed to transform and manipulate objects in 3D space,
                projecting them onto the camera for rendering. By leveraging <b>transformation matrices</b>, the engine can handle
                complex 3D operations, ensuring that objects are accurately placed and oriented within the game world.
                It also features an algorithm that converts a .obj file to a Mesh object, which can be rendered in the
                engine. <b>This allows the user to import 3D models created in Blender and render them in real-time.</b>
            </p>
            <p>
                I am extremely passionate with mathematical problems especially when it comes to 3D Geometry. This project
                was a lot of fun to work on. Getting to see the 3D models I created in Blender rendered in real-time and
                applying linear algebra concepts to manipulate them was a very rewarding experience.
            </p>
            <div className={"mt-4 w-full h-fit flex flex-row justify-center gap-[2%] items-center"}>
                <MediaCaption src={"/videos/software/console3D_monkey.mp4"}
                              alt={"3D Monkey model"}
                              type={"video"}
                              caption={"3D Monkey model imported from Blender rendered in console"}
                              count={2} />
                <MediaCaption src={"/videos/software/console3D_mountains.mp4"}
                              alt={"3D Mountains Scene"}
                              type={"video"}
                              caption={"Flying over mountains in 3D space"}
                              count={3}/>
            </div>
            <p>
                Perhaps the most challenging aspect of this project was implementing the <b>clipping algorithm</b>, which is
                responsible for determining which parts of an object are visible to the camera. By using a combination of
                back-face culling and depth buffering, the engine can accurately determine which parts of an object should
                be rendered, ensuring that only the visible portions are displayed on the screen. This was a complex
                process that required a deep understanding of 3D graphics and rendering techniques. At the end, I was able
                to make a fully functional clipping mechanism, which greatly improved the performance of the engine.
            </p>
            <p>
                Nonetheless, the engine is still a work in progress. I plan to continue experimenting, adding new features
                such as texture mapping, lighting, and shadows. I would also like to leverage my GPU to improve the
                rendering performance and make the engine more efficient.
            </p>
            {/****************** End of Console3D **************/}



            {/****************** GunRunner *********************/}
            <h4 className={"flex flex-row justify-between items-center"}>
                GunRunner
                <a className={"flex text-3xl flex-row items-center gap-2"}
                   href={'https://github.com/FehamIsmail/GunRunner'} target="_blank" rel="noreferrer noopener">
                    <Image className={"mb-[2px]"} src={github.src} width={24} height={24} alt={"Github's Logo"}/>
                    [GitHub]
                </a>
            </h4>
            <p>
                I left this one for the end, as it is the <b>first project I have ever worked on</b>. GunRunner is a 2D platformer
                shooter game built in Java using <b>JavaFX</b> from the ground up. What makes this project special to me is that
                every aspect of the game is <b>original</b>, from the graphics, sprites, background images, to the physics engine.
                It was the first  ever full-fledged programming project I have ever worked on. Our ambitious team wanted to challenge
                ourselves by creating a game would be <b>fun to play</b>, <b>procedurally generated</b>, <b>challenging</b>, <b>and
                rewarding</b>. This game was inspired by games such as Jetpack Joyride and Subway Surfers.
            </p>
            <p>
                The game features a procedurally generated level that is different every time you play. The player must
                jump over obstacles, collect coins, and avoid enemies. The game also features power-ups in the form of
                blue crates that give the player a special weapon with limited ammo. Coins can be used to purchase
                additional skins for the player, making the game more engaging and rewarding.
            </p>
            <div className={"mt-4 w-full h-fit flex flex-row justify-between gap-4 items-center"}>
                <MediaCaption src={"/videos/software/gun_runner_gameplay.mp4"}
                              alt={"GunRunner Gameplay"}
                              type={"video"}
                              caption={"Gameplay of the GunRunner"}
                              count={4}/>
                <MediaCaption src={"/videos/software/gun_runner_preview.mp4"}
                              alt={"GunRunner Preview"}
                              type={"video"}
                              caption={"Preview of the unlockable items in the game"}
                              count={5}/>
            </div>
            <p>
                There were a lot of learning key points in this project. We learned about <b>game loops</b>, <b>collision detection</b>,
                <b> sprite rendering</b>, <b>game state management</b>, and <b>memory persistence</b> using <b>SQLite</b>.
                We also learned about the importance of project management and teamwork, as we had to coordinate our efforts
                to meet deadlines and ensure that the project was completed on time. We realized that creating a game is a
                complex process, especially using JavaFX, which is not designed for game development.
            </p>
            <p>
                I wish to eventually
                recreate this game using a more suitable game engine such as Unity as the idea is seems promising.
            </p>
            {/****************** End of GunRunner **************/}
        </div>
    );
};

export default Software;