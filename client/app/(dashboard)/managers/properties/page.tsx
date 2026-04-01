
import Card from "@/components/Card";
import Header from "@/components/Header";
import { getManagerProperties } from "@/lib/actions/manager";
import { getAuthUser } from "@/lib/actions/user";

import React from "react";

const page = async () => {
    const authUser = (await getAuthUser())?.data
    const properties = (await getManagerProperties(authUser.id))?.data

    return (
        <div className="dashboard-container">
            <Header
                title="Favorited Properties"
                subtitle="Browse and manage your saved property listings"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">

                {properties?.map((property) => (
                    <Card
                        key={property?.id}
                        property={property}
                        isFavorite={true}
                        showFavoriteButton={false}
                        propertyLink={`/tenants/residences/${property?.id}`}
                    />
                ))}
            </div>
            {(!properties || properties?.length === 0) && (
                <p>You don&lsquo;t have any favorited properties</p>
            )}
        </div>
    );
};

export default page;