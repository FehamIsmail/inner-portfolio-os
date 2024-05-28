import React from 'react';
import mdv_bill from "@/assets/resources/projects/business/500_BILL_MDV filtered.png";
import mdv_back from "@/assets/resources/projects/business/mdv_back.png";
import mdv_front from "@/assets/resources/projects/business/mdv_front.png";
import cap_black from "@/assets/resources/projects/business/cap_black.png";
import cap_white from "@/assets/resources/projects/business/cap_white.png";
import MediaCaption from "@/components/portfolio/MediaCaption";
import ImageExplorer from "@/components/common/ImageExplorer";

const Business = () => {
    return (
        <div>
            <h2>The journey of creating our own brand</h2>
            <div className={"px-40"}>
            <MediaCaption
                className={"mt-4"}
                src={mdv_bill.src}
                alt={"MDV Billboard"}
                type={"image"}
                caption={"MDV 500 BILL"}
                count={1}
            />
            </div>
            <p>
                In the summer of 2022, my friend and I decided to start our own business. We wanted to create a brand that
                would resonate with the youth and provide them with high-quality products. We named our brand
                &nbsp;<b>Mode De Vie</b>&nbsp;and started by selling custom-designed t-shirts. We wanted to create a brand
                that would inspire others to live life to the fullest and express themselves through fashion. We worked
                tirelessly to design unique and eye-catching t-shirts that would appeal to our target audience. We also
                focused on creating a strong online presence through social media and digital marketing.
            </p>

            <p>
                We wanted to be as independent as possible, so we decided to handle everything ourselves, from designing
                the t-shirts to managing the website and handling customer service. It was a challenging but rewarding
                experience that taught us a lot about entrepreneurship and business management. We learned how to create
                a brand identity, market our products effectively, and build a loyal customer base. We also learned the
                importance of customer feedback and how to use it to improve our products and services.
            </p>
            <div className={"mt-4 px-10 flex flex-row gap-10 w-full"}>
                <ImageExplorer className={"flex-1"} images={[mdv_front.src, mdv_back.src]} />
                <ImageExplorer className={"flex-1"} images={[cap_black.src, cap_white.src]} />
            </div>
        </div>
    );
};

export default Business;