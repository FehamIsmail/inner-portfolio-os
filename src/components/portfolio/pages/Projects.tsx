"use client";

import React from "react";
import Link from "next/link";
import arts_card from "@/assets/images/projects/arts_card.gif";
import software_card from "@/assets/images/projects/software_card.gif";
import business_card from "@/assets/images/projects/business_card.gif";
import Image from "next/image";
import { usePortfolioWindow } from "@/components/portfolio/PortfolioWindowContext";

type Project = Omit<ProjectCardProps, "paddingClass">;

const projects: Project[] = [
  {
    name: "Arts",
    href: "/projects/arts",
    src: arts_card.src,
  },
  {
    name: "Software",
    href: "/projects/software",
    src: software_card.src,
  },
  {
    name: "Business",
    href: "/projects/business",
    src: business_card.src,
  },
];

const Projects = () => {
  const { contentWidth } = usePortfolioWindow();

  // Column count follows the content pane, not the browser viewport —
  // otherwise a narrow window on a large display keeps multi-column layouts
  // and the GIFs collapse.
  // 3 cards: avoid a 2-col layout (reads as an uneven 2x2). One-per-row only when
  // the pane is too narrow for three cards; otherwise keep all three on a single row.
  const columns = contentWidth > 0 && contentWidth < 900 ? 1 : 3;
  const paddingClass =
    contentWidth > 0 && contentWidth < 900
      ? "py-8 px-5"
      : contentWidth > 0 && contentWidth < 1100
        ? "py-10 px-6"
        : "py-16 px-10";

  return (
    <div className={""}>
      <h2>& Passions</h2>
      <div
        className="mt-8 sm:mt-16 grid gap-6 justify-items-center"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            name={project.name}
            href={project.href}
            src={project.src}
            paddingClass={paddingClass}
          />
        ))}
      </div>
    </div>
  );
};

interface ProjectCardProps {
  name: string;
  href: string;
  src: string;
  paddingClass: string;
}

const ProjectCard = (props: ProjectCardProps) => {
  return (
    <Link
      href={props.href}
      className="w-full max-w-[350px] min-w-0 flex flex-col items-center justify-center p-[6px]
        hover:bg-retro-medium hover:outline hover:outline-retro-dark hover:outline-[3px] rounded-md"
    >
      <div
        className={`w-full rounded-lg border-3 border-retro-dark bg-retro-white flex-1 flex items-center justify-center ${props.paddingClass}`}
      >
        <Image
          className="rounded-md w-full h-auto max-w-[250px]"
          width={250}
          height={250}
          src={props.src}
          alt={props.name}
        />
      </div>
      <h2 className={"mt-3 mb-2"}>{props.name}</h2>
    </Link>
  );
};

export default Projects;
