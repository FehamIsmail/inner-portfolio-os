import React from 'react';
import Link from "next/link";
import arts_card from "@/assets/images/projects/arts_card.gif";
import software_card from "@/assets/images/projects/software_card.gif";
import business_card from "@/assets/images/projects/business_card.gif";
import Image from "next/image";

const projects: ProjectCardProps[] = [
    {
        name: "Arts",
        href: "/projects/arts",
        src: arts_card.src
    },
    {
        name: "Software",
        href: "/projects/software",
        src: software_card.src
    },
    {
        name: "Business",
        href: "/projects/business",
        src: business_card.src
    }

]

const Projects = () => {
    return (
        <div className={""}>
            <h2>& Passions</h2>
            <div className="mt-16 flex flex-row gap-6 justify-center">
                {projects.map((project, index) => (
                    <ProjectCard key={index} name={project.name} href={project.href} src={project.src} />
                    ))}
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
        <Link href={props.href} className="flex flex-col items-center justify-center p-[6px]
        hover: hover:bg-retro-medium hover:outline hover:outline-retro-dark hover:outline-[3px] rounded-md">
            <div className="py-16 px-10 rounded-lg border-3 border-retro-dark bg-retro-white flex-1">
                <Image
                    className="rounded-md "
                    width={250}
                    height={250}
                    src={props.src}
                    alt={props.name}
                />
            </div>
            <h2 className={"mt-3 mb-2"}>{props.name}</h2>
        </Link>
    )

}

export default Projects;