
import Card from "@/components/Card";
import Header from "@/components/Header";
import { getTenent } from "@/lib/actions/tenant";
import { getAuthUser } from "@/lib/actions/user";

import React from "react";

const Favorites = async () => {
    const authUser = (await getAuthUser())?.data

    if (!authUser?.id) {
        return (
            <div className="dashboard-container">
                <Header title="Favorited Properties" subtitle="Please log in to view properties" />
                <p>You must be logged in to view this page.</p>
            </div>
        );
    }

    const tenant = (await getTenent(authUser.id))?.data
    const favoriteProperties = tenant.favorites

    return (
        <div className="dashboard-container">
            <Header
                title="Favorited Properties"
                subtitle="Browse and manage your saved property listings"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {favoriteProperties?.map((property) => (
                    <Card
                        key={property.id}
                        property={property}
                        isFavorite={true}
                        showFavoriteButton={false}
                        propertyLink={`/tenants/residences/${property.id}`}
                    />
                ))}
            </div>
            {(!favoriteProperties || favoriteProperties.length === 0) && (
                <p>You don&lsquo;t have any favorited properties</p>
            )}
        </div>
    );
};

export default Favorites;