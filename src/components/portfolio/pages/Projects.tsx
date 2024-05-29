import React from 'react';
import Link from "next/link";
import arts_card from "@/assets/images/projects/arts_card.gif";
import Image from "next/image";

const Projects = () => {
    return (
        <div className={""}>
            <h2>& Passions</h2>
            <div className="mt-8 flex flex-row gap-6 justify-center">
                <ProjectCard
                    name={"Arts"}
                    href={"/projects/arts"}
                    src={arts_card.src}
                />
            </div>
        </div>
    );
};

interface ProjectCardProps {
    name: string;
    href: string;
    src: string;
}

const ProjectCard = (props: ProjectCardProps) => {

    // Create a vertical card with the project name and image
    return (
        <Link href={props} className="flex flex-col items-center justify-center">
            <Image
                className="rounded-md shadow-figure border-3 border-retro-dark"
                width={280}
                height={280}
                src={props.src}
                alt={props.name}
            />
            <h2>{props.name}</h2>
        </Link>
    )

}

export default Projects;