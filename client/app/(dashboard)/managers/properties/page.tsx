import Header from "@/components/Header";
import { getManagerProperties } from "@/lib/actions/manager";
import { getAuthUser } from "@/lib/actions/user";
import React from "react";
import PropertyList from "./_components/PropertyList";

const page = async () => {
    const authUser = (await getAuthUser())?.data
    // 2. Guard clause: If no user, don't try to fetch properties
    if (!authUser?.id) {
        return (
            <div className="dashboard-container">
                <Header title="Properties" subtitle="Please log in to view properties" />
                <p>You must be logged in to view this page.</p>
            </div>
        );
    }

    const properties = (await getManagerProperties(authUser.id))?.data

    return (
        <div>
            <Header
                title="Properties"
                subtitle="Browse and manage your property listings"
            />
            <PropertyList properties={properties} />
        </div>
    );
};

export default page;