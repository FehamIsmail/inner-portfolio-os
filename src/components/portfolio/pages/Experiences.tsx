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
                location={"Quebec City, QC, Canada (Remote)"}
                startDate={"May 2024"}
                endDate={"Present"}
                description={"Specializing in HR data integration, Flexspring provided solutions to optimize HR processes and eliminate manual double-data entry for companies and HR software applications." +
                    " Relevant technologies: React TS, React Query, Metronics, Java Spring Boot, AWS Cognito, Redis, PostgreSQL, Docker, Jenkins, Sentry, and SonarQube."}
                bullets={[
                    "Actively developed and implemented new frontend features using React TypeScript, React Query, TanStack, and Metronics, resulting in improved user interface and performance.",
                    "Built and maintained backend services with Java Spring Boot, utilizing AWS Cognito for authentication, and managed data with databases such as Redis, Aurora, and PostgreSQL.",
                    "Followed a formal continuous delivery/continuous integration (CD/CI) process, utilizing Docker, Jenkins, Sentry, and SonarQube to ensure reliable and efficient software delivery.",
                    "Involved modernization efforts by removing legacy code and obsolete technologies like Redux, and introducing cutting-edge solutions such as TanStack's React Query, optimizing codebase efficiency and maintenance."
                ]}
                websiteUrl={"https://flexspring.com"}
                website={"www.flexspring.com"}
            />
            <WorkExperience
                company={"Ross Video"}
                title={"Full Stack Developer"}
                location={"Ottawa, ON, Canada (Remote)"}
                startDate={"September 2022"}
                endDate={"December 2022"}
                description={"Ross Video is a global leader in live video production technology, providing solutions for broadcast, sports, live events, and more." +
                    " Relevant technologies: React TS, Redux, Node.js, AJAX, Java Struts II, Jenkins, and JIRA."}
                bullets={[
                    "Presented bi-monthly progress updates to stakeholders, incorporating feedback to build trust and ensure project alignment.",
                    "Designed and developed user-facing features using ReactJS, TypeScript, Redux, and Ajax for enhanced frontend functionality.",
                    "Built and maintained backend services with Java Struts II, including the implementation of Ajax Events for seamless data transmission.",
                    "Significantly reduced latency by engineering a WebRTC-based real-time communication service, leveraging NodeJS as a signaling server, for a seamless peer-to-peer connection.",
                    "Contributed to Agile and Scrum development methodologies, effectively managing tasks and meeting sprint deadlines."
                ]}
                websiteUrl={"https://www.rossvideo.com/"}
                website={"www.rossvideo.com"}
            />
        </div>
    );
};

export default Experiences;