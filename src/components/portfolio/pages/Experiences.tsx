import React from "react";
import ResumeDownload from "@/components/portfolio/ResumeDownload";
import WorkExperience from "@/components/portfolio/WorkExperience";
import ImageExplorer from "@/components/common/ImageExplorer";

import coin1 from "../../../../public/images/coinbase/coin1.png";
import coin2 from "../../../../public/images/coinbase/coin2.png";
import coin3 from "../../../../public/images/coinbase/coin3.png";

import innov1 from "../../../../public/images/innovmetric/innov1.png";
import innov2 from "../../../../public/images/innovmetric/innov2.png";
import innov3 from "../../../../public/images/innovmetric/innov3.png";

import ross1 from "../../../../public/images/rossvideo/ross1.png";
import ross2 from "../../../../public/images/rossvideo/ross2.png";
import ross3 from "../../../../public/images/rossvideo/ross3.png";

import flex1 from "../../../../public/images/flexspring/flex2.png";
import flex2 from "../../../../public/images/flexspring/flex1.png";
import flex3 from "../../../../public/images/flexspring/flex3.png";

const Experiences = () => {
  return (
    <div className={"pt-4"}>
      <ResumeDownload margin={20} />
      <WorkExperience
        company={"Coinbase"}
        title={"Software Engineer"}
        location={"Remote (Canada)"}
        startDate={"September 2025"}
        endDate={"May 2026"}
        description={
          "Built and shipped consumer product for Coinbase Web and Mobile on the Home & App team, focusing on Home and Search — two of the platform's highest-traffic surfaces." +
          " Technologies: React, React Native, TypeScript, GraphQL, Snowflake, Datadog, Sentry, Claude Code, Cursor, n8n"
        }
        bullets={[
          "Shipped high-impact features for Coinbase Web and the Coinbase Mobile app across Home and Search.",
          "Owned end-to-end experiments on consumer surfaces — designing, implementing, analyzing, and resolving A/B tests that increased DEX trades by 10% and contributed to 2% growth in overall consumer revenue.",
          "Implemented Snowflake-based analytics instrumentation for revenue and CTR metrics, enabling reliable experiment evaluation and data-driven product decisions.",
          "Led a performance initiative improving Core Web Vitals, reducing Home page navigation blocking time (NTBT) by 24% for millions of weekly active users.",
          "Supported production systems through on-call rotations using Datadog and Sentry, investigating regressions and monitoring HTTP requests, latency, and error rates.",
        ]}
        websiteUrl={"https://www.coinbase.com"}
        website={"www.coinbase.com"}
      />
      <div className={"pr-0 lg:pr-8"}>
        <ImageExplorer
          className={"mt-8 mx-auto lg:ml-12"}
          images={[
            {
              name: "Coinbase Web — Trade",
              image: coin1,
            },
            {
              name: "Coinbase Mobile — Home & Trade",
              image: coin2,
            },
            {
              name: "Coinbase Web — Advanced Trade",
              image: coin3,
            },
          ]}
          height={500}
          width={900}
        />
      </div>
      <WorkExperience
        company={"InnovMetric"}
        title={"Backend Developer Intern"}
        location={"Quebec City, QC"}
        startDate={"September 2024"}
        endDate={"December 2024"}
        description={
          "InnovMetric specializes in 3D metrology software solutions, developing cutting-edge inspection and measurement tools for manufacturing industries." +
          " Technologies: C++, Visual Studio, Python, MVVM, BOOST, MSCL"
        }
        bullets={[
          "Profiled and optimized C++ performance tests, identifying algorithmic bottlenecks and reducing execution time by 95%.",
          "Contributed within a large C++ codebase, navigating and modifying interconnected modules in a 3D inspection platform.",
          "Improved end-user experience with dropdown menus and status indicators for geometrical standard selection, and delivered a well-received technical demo to stakeholders.",
          "Designed and implemented a command module for editing inspection configurations, with robust unit and integration testing using the BOOST testing framework.",
        ]}
        websiteUrl={"https://www.innovmetric.com"}
        website={"www.innovmetric.com"}
      />
      <div className={"w-full"}>
        <ImageExplorer
          className={"mt-8 mx-auto lg:ml-auto lg:mr-24"}
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
        title={"Software Developer Intern"}
        location={"Quebec City, QC"}
        startDate={"May 2024"}
        endDate={"August 2024"}
        description={
          "Specializing in HR data integration, Flexspring provided solutions to optimize HR processes and eliminate manual double-data entry for companies and HR software applications." +
          " Technologies: React TS, React Query, Java Spring Boot, AWS Cognito, Redis, PostgreSQL, Docker, Jenkins, Sentry"
        }
        bullets={[
          "Modernized the UI by replacing Redux with TanStack Query, simplifying state management and cutting up to 30% LOC in key components.",
          "Developed and implemented new frontend features with React TS, React Query, and Metronics.",
          "Built backend services in Linux using Java Spring Boot, with AWS Cognito for authentication and Redis, Aurora, and PostgreSQL for data.",
          "Utilized Docker, Jenkins, Sentry, and SonarQube in a formal CI/CD process for reliable software delivery.",
        ]}
        websiteUrl={"https://flexspring.com"}
        website={"www.flexspring.com"}
      />
      <div className={"pr-0 lg:pr-8"}>
        <ImageExplorer
          className={"mt-8 mx-auto lg:ml-12"}
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
        title={"Software Developer Intern"}
        location={"Ottawa, ON"}
        startDate={"August 2022"}
        endDate={"December 2022"}
        description={
          "Ross Video is a global leader in live video production technology, providing solutions for broadcast, sports, live events, and more." +
          " Technologies: React, Redux, Node.js, AJAX, Java Struts II, WebRTC"
        }
        bullets={[
          "Minimized latency by over 70% by migrating a WebSocket-based system to a WebRTC peer-to-peer service, using Node.js as a lightweight signaling server.",
          "Presented monthly updates to stakeholders, incorporating feedback to build trust and ensure project alignment.",
          "Designed and developed UI features using React and Redux for state management.",
          "Maintained backend services with Java Struts II, implementing AJAX Events for server-view synchronization.",
        ]}
        websiteUrl={"https://www.rossvideo.com"}
        website={"www.rossvideo.com"}
      />
      <div className={"w-full"}>
        <ImageExplorer
          className={"mt-8 mx-auto lg:ml-auto lg:mr-24"}
          images={[
            {
              name: "Ross Video 1",
              image: ross1,
            },
            {
              name: "Ross Video 2",
              image: ross2,
            },
            {
              name: "Ross Video 3",
              image: ross3,
            },
          ]}
          height={500}
          width={900}
        />
      </div>
    </div>
  );
};

export default Experiences;
