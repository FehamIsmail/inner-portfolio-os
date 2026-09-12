"use client";

import React from "react";
import { usePortfolioWindow } from "@/components/portfolio/PortfolioWindowContext";

interface WorkExperienceProps {
  company: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  bullets: string[];
  websiteUrl: string;
  website: string;
}

const WorkExperience = (props: WorkExperienceProps) => {
  const { bp } = usePortfolioWindow();
  // Side-by-side meta only when the content pane is wide enough — viewport
  // `sm:flex-row` was packing location/dates into a cramped column on desktop
  // window resize.
  const sideBySide = bp.sm;

  return (
    <div className={"mt-8"}>
      <div className="flex flex-col justify-between">
        <div
          className={`flex gap-2 ${
            sideBySide
              ? "min-h-[100px] flex-row justify-between items-end"
              : "flex-col"
          }`}
        >
          <div className={"min-w-0 [&>*]:mt-0"}>
            <h2 className="text-md font-nevrada font-semibold">
              {props.company}
            </h2>
            <h3 className="text-3xl font-bold break-words">{props.title}</h3>
          </div>
          <div
            className={`flex flex-col shrink-0 [&>*]:mt-0 mt-0 ${
              sideBySide ? "items-end mb-2 text-right" : "items-start"
            }`}
          >
            <p className={`mt-0 font-normal ${sideBySide ? "text-right" : ""}`}>
              {props.location}
            </p>
            <p className={`mt-0 font-bold ${sideBySide ? "text-right" : ""}`}>
              {props.startDate} - {props.endDate}
            </p>
          </div>
        </div>
        <a
          className="break-all"
          href={props.websiteUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          {props.website}
        </a>
        <p className={"mt-4"}>{props.description}</p>
        <ul
          className={`mt-4 list-disc font-normal ${sideBySide ? "pl-9" : "pl-5"}`}
        >
          {props.bullets.map((bullet, index) => (
            <li className={"mt-2"} key={index}>
              {bullet}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WorkExperience;
