import ApplicationCard from "@/components/ApplicationCard";
import ApplicationList from "@/components/ApplicationList";
import Header from "@/components/Header";
import { listApplications } from "@/lib/actions/application";
import { getAuthUser } from "@/lib/actions/user";
import { CircleCheckBig, Clock, Download, XCircle } from "lucide-react";
import React from "react";

const Applications = async () => {

    const authUser = (await getAuthUser())?.data

    if (!authUser?.id) {
        return (
            <div className="dashboard-container">
                <Header title="Applications" subtitle="Please log in to view Applications" />
                <p>You must be logged in to view this page.</p>
            </div>
        );
    }
    const applications = await listApplications(authUser.id, "tenant");

    return (
        <div className="dashboard-container">
            <Header
                title="Applications"
                subtitle="Track your property applications"
            />
            <ApplicationList applications={applications?.data} user="tenant" />
        </div>
    );
};

export default Applications;