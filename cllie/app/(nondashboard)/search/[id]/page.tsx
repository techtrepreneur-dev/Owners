
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
import ImagePreviews from "./_components/ImagePreview";
import PropertyOverview from "./_components/PropertyOverview";
import PropertyDetails from "./_components/PropertyDetails";
import PropertyLocation from "./_components/PropertyLocation";
import ContactWidget from "./_components/ContactWidget";
import { getProperty } from "@/lib/actions/property";
import ApplicationModal from "./_components/ApplicationModal";

type Param = {
    params: Promise<{ id: string }>
}

export default async function page({ params }: Param) {

    const id = (await params).id

    // fetch property from backend
    const property = (await getProperty(id)).data
    return (
        <div>
            <ImagePreviews
                images={["/singlelisting-2.jpg", "/singlelisting-3.jpg"]}
            />
            <div className="flex flex-col md:flex-row justify-center gap-10 mx-10 md:w-2/3 md:mx-auto mt-16 mb-8">
                <div className="order-2 md:order-1">
                    <PropertyOverview property={property} />
                    <PropertyDetails property={property} />
                    <PropertyLocation property={property} />
                </div>

                <div className="order-1 md:order-2">
                    <ContactWidget
                        propertyId={property.id}
                    />
                </div>
            </div>

            {/* {authUser && (
                <ApplicationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    propertyId={propertyId}
                />
            )} */}
        </div>
    );
};
