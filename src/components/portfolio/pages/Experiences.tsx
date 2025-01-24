import React from "react";
import ResumeDownload from "@/components/portfolio/ResumeDownload";
import WorkExperience from "@/components/portfolio/WorkExperience";
import ImageExplorer from "@/components/common/ImageExplorer";

import innov1 from "../../../../public/images/innovmetric/innov1.png";
import innov2 from "../../../../public/images/innovmetric/innov2.png";
import innov3 from "../../../../public/images/innovmetric/innov3.png";

import ross1 from "../../../../public/images/rossvideo/ross1.png";

import flex1 from "../../../../public/images/flexspring/flex2.png";
import flex2 from "../../../../public/images/flexspring/flex1.png";
import flex3 from "../../../../public/images/flexspring/flex3.png";

const Experiences = () => {
  return (
    <div className={"pt-4"}>
      <ResumeDownload margin={20} />
      <WorkExperience
        company={"InnovMetric"}
        title={"C++ 3D Software Developer"}
        location={"Quebec City, QC (Remote)"}
        startDate={"September 2024"}
        endDate={"December 2024"}
        description={
          "InnovMetric specializes in 3D metrology software solutions, developing cutting-edge inspection and measurement tools for manufacturing industries." +
          " Technologies: C++, Visual Studio, Python, MVVM, BOOST, MSCL"
        }
        bullets={[
          "Refactored and redesigned performance tests, reducing execution time by 95%, boosting test suite efficiency.",
          "Contributed to the team's R&D project on the 3D inspection platform, ensuring the accuracy of GD&T calculations and resolving alignment challenges - working specifically with the codebase's Object-Relational Mappers.",
          "Enhanced user experience through UI improvements, including dropdown menus and status bar indicators for GD&T standard selection, and delivered a well-received demo to stakeholders.",
          "Developed a command for modifying data alignment groups in PolyWorks|Inspector, implementing dialogs with MVVM architecture and rigorous unit and integration tests using BOOST and MSCL.",
        ]}
        websiteUrl={"https://www.innovmetric.com"}
        website={"www.innovmetric.com"}
      />
      <div className={"pr-8"}>
        <ImageExplorer
          className={"mt-8 ml-12"}
          images={[
            {
              name: "InnovMetric 1",
              image: innov1,
            },
            {
              name: "InnovMetric 2",
              image: innov2,
            },
            {
              name: "InnovMetric 3",
              image: innov3,
            },
          ]}
          height={500}
          width={900}
        />
      </div>
      <WorkExperience
        company={"Flexspring"}
        title={"Full Stack Developer"}
        location={"Quebec City, QC, Canada (Remote)"}
        startDate={"May 2024"}
        endDate={"August 2024"}
        description={
          "Specializing in HR data integration, Flexspring provided solutions to optimize HR processes and eliminate manual double-data entry for companies and HR software applications." +
          " Technologies: React TS, React Query, Java Spring Boot, AWS Cognito, Redis, PostgreSQL, Docker, Jenkins, Sentry"
        }
        bullets={[
          "Developed and implemented new frontend features with React TS, React Query, and Metronics.",
          "Built backend services using Java Spring Boot with AWS Cognito for authentication, and managed data with Redis, Aurora, and PostgreSQL.",
          "Utilized Docker, Jenkins, Sentry, and SonarQube in a formal CD/CI process for reliable software delivery.",
          "Modernized the UI by replacing Redux with TanStack Query, improving performance and reducing boilerplate.",
        ]}
        websiteUrl={"https://flexspring.com"}
        website={"www.flexspring.com"}
      />
      <div className={"w-full"}>
        <ImageExplorer
          className={"mt-8 ml-auto mr-24"}
          images={[
            {
              name: "Flexspring 1",
              image: flex1,
            },
            {
              name: "Flexspring 2",
              image: flex2,
            },
            {
              name: "Flexspring 3",
              image: flex3,
            },
          ]}
          height={500}
          width={900}
        />
      </div>
      <WorkExperience
        company={"Ross Video"}
        title={"Full Stack Developer"}
        location={"Ottawa, ON, Canada (Remote)"}
        startDate={"August 2022"}
        endDate={"December 2022"}
        description={
          "Ross Video is a global leader in live video production technology, providing solutions for broadcast, sports, live events, and more." +
          " Technologies: React TS, Redux, Node.js, AJAX, Java Struts II, WebRTC"
        }
        bullets={[
          "Presented bi-monthly updates to stakeholders, incorporating feedback to build trust and ensure project alignment.",
          "Designed and developed UI features using React TS, Redux, and AJAX for enhanced frontend functionality.",
          "Maintained backend services with Java Struts II, implementing AJAX Events for server-view synchronization.",
          "Significantly reduced latency by engineering a WebRTC-based real-time, peer-to-peer communication service while leveraging NodeJS as a signaling server.",
        ]}
        websiteUrl={"https://www.rossvideo.com"}
        website={"www.rossvideo.com"}
      />
      <ImageExplorer
        className={"mt-8 ml-12"}
        images={[
          {
            name: "Ross Video 1",
            image: ross1,
          },
          {
            name: "Ross Video 2",
            image: innov2,
          },
          {
            name: "Ross Video 3",
            image: innov3,
          },
        ]}
        height={500}
        width={900}
      />
    </div>
  );
};

export default Experiences;
