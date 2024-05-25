import React from 'react';


interface WorkExperienceProps {
    company: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    bullets: string[];
    website: string;
}
const WorkExperience = (props: WorkExperienceProps) => {
    return (
        <div className={"mt-8"}>
            <div className="flex flex-col justify-between">
                <div className="flex flex-row justify-between items-center gap-3">
                    <div className={"[&>*]:mt-0"}>
                        <h2 className="text-md font-nevrada font-semibold">{props.company}</h2>
                        <h3 className="-mt-2 text-3xl font-bold">{props.title}</h3>
                    </div>
                    <div className={"[&>*]:mt-"}>
                        <p className="text-md font-normal">{props.location}</p>
                        <p className="text-md font-normal">{props.location}</p>
                        <p className="text-md font-bold">{props.startDate} - {props.endDate}</p>
                    </div>


                </div>
                <p>{props.description}</p>
                <ul>
                    {props.bullets.map((bullet, index) => (
                        <li key={index}>{bullet}</li>
                    ))}
                </ul>
                <a href={props.website} target="_blank" rel="noreferrer noopener">Website</a>
            </div>
        </div>

    );
};

export default WorkExperience;