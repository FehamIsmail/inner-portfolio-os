import React from "react";

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
  return (
    <div className={"mt-8"}>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-2 sm:min-h-[100px] sm:flex-row sm:justify-between sm:items-end">
          <div className={"[&>*]:mt-0"}>
            <h2 className="text-md font-nevrada font-semibold">
              {props.company}
            </h2>
            <h3 className=" text-3xl font-bold">{props.title}</h3>
          </div>
          <div className={"flex flex-col items-start sm:items-end [&>*]:mt-0 mt-0 sm:mb-2"}>
            <p className="mt-0 font-normal sm:text-right">{props.location}</p>
            <p className="mt-0 font-bold sm:text-right">
              {props.startDate} - {props.endDate}
            </p>
          </div>
        </div>
        <a className="break-all" href={props.websiteUrl} target="_blank" rel="noreferrer noopener">
          {props.website}
        </a>
        <p className={"mt-4"}>{props.description}</p>
        <ul className={"mt-4 list-disc font-normal pl-5 sm:pl-9"}>
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
