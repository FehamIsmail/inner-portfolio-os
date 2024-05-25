import React from 'react';
import ResumeDownload from "@/components/portfolio/ResumeDownload";
import WorkExperience from "@/components/portfolio/WorkExperience";

const Experiences = () => {
    return (
        <div className={"pt-4"}>
            <ResumeDownload margin={20} />
            <WorkExperience
                company={"Flexspring"}
                title={"Full Stack Developer"}
                location={"Ottawa, ON, Canada"}
                startDate={"May 2024"}
                endDate={"Present"}
                description={"Developed and maintained a web application for a client using React, Node.js, and MongoDB. The application was used to manage and track the progress of projects."}
                bullets={[
                    "Designed and implemented RESTful APIs to interact with the database.",
                    "Developed the front-end using React and Material-UI.",
                    "Implemented user authentication and authorization using JWT.",
                    "Deployed the application to Heroku.",
                ]}
                website={"https://flexspring.com"}
            />
        </div>
    );
};

export default Experiences;