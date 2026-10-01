"use client"
import ApplicationCard from "@/components/ApplicationCard";
import Header from "@/components/Header";
import { CircleCheckBig, Clock, Download, XCircle } from "lucide-react";
import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { FiSliders } from "react-icons/fi";

const ApplicationList = ({ applications, user }) => {

    const [applicationData, setapplicationData] = useState(applications);
    const [filterOptions, setFilterOptions] = useState(['status', 'all']);

    const flattenedApplications = applications.flat();

    // 2. Filter for unique objects based on property.id
    const properties = Array.from(
        new Map(flattenedApplications.map(app => [app.property?.id, app])).values()
    );


    function handleFilter(type, value) {
        let result
        if (type == "status") {
            result = value !== 'all' ? applications.filter((app) => app.status == value) : applications
            setFilterOptions([type, value])
        }
        if (type == "days") {
            result = value !== 'all' ? applications.filter((app) => app.day == value) : applications
            setFilterOptions([type, value])
        }
        if (type == "property") {
            result = value !== 'all' ? applications.filter((app) => app.property.id == value) : applications
            setFilterOptions([type, value])
        }
        setapplicationData(result)
    }

    return (
        <div className="w-full">
            {/* filters */}
            <div className="flex justify-between items-center mb-3 px-3">
                <div className="flex gap-3 p-2 rounded bg-primary-100">
                    <button onClick={() => handleFilter("status", "all")} className={`border ${(filterOptions[1] === "all" && filterOptions[0] === "status") ? "bg-primary-700 text-primary-100 border-secondary-800" : "border-primary-300 text-primary-600"}  rounded cursor-pointer px-3 py-1  text-[12px]`}>All</button>
                    <button onClick={() => handleFilter("status", "Pending")} className={`border ${filterOptions[1] === "Pending" ? "bg-primary-700 text-primary-100 border-secondary-800" : "border-primary-300 text-primary-600"}  rounded cursor-pointer px-3 py-1  text-[12px]`}>Pending</button>
                    <button onClick={() => handleFilter("status", "Approved")} className={`border ${filterOptions[1] === "Approved" ? "bg-primary-700 text-primary-100 border-secondary-800" : "border-primary-300 text-primary-600"}  rounded cursor-pointer px-3 py-1  text-[12px]`}>Approved</button>
                </div>
                {user === "manager" &&
                    <DropdownMenu>
                        <DropdownMenuTrigger className="flex items-center cursor-pointer gap-2 focus:outline-none">
                            <FiSliders className="text-gray-500 h-7 w-7 p-1.5 rounded-full shadow-md border border-gray-300 bg-primary-100 " />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-96 p-2 bg-white border border-primary-200 text-primary-700">
                            <div className="text-sm">Filter by:</div>
                            <div className='flex gap-3 my-1'>
                                <button
                                    onClick={() => handleFilter("status", "all")}
                                    className={`w-full text-left px-3 py-2 text-[12px] rounded-md transition-colors duration-150 flex items-center
                                                bg-primary-50 text-primary-600 border border-primary-200 border-l-3 ${filterOptions[0] === "status" ? "border-l-secondary-800" : "border-l-primary-600"}`}>
                                    <span>Status</span>
                                </button>
                                <button
                                    onClick={() => handleFilter("days", "all")}
                                    className={`w-full text-left px-3 py-2 text-[12px] rounded-md transition-colors duration-150 flex items-center
                                                bg-primary-50 text-primary-600 border border-primary-200 border-l-3 ${filterOptions[0] === "days" ? "border-l-secondary-800" : "border-l-primary-600"}`}>
                                    <span>Days</span>
                                </button>
                                <button
                                    onClick={() => handleFilter("property", "all")}
                                    className={`w-full text-left px-3 py-2 text-[12px] rounded-md transition-colors duration-150 flex items-center
                                                bg-primary-50 text-primary-600 border border-primary-200 border-l-3 ${filterOptions[0] === "property" ? "border-l-secondary-800" : "border-l-primary-600"}`}>
                                    <span>Property</span>
                                </button>
                            </div>
                            <DropdownMenuSeparator className="bg-primary-200 mt-2" />
                            {filterOptions[0] === "status" &&
                                <div>
                                    <div
                                        className={`cursor-pointer px-2 py-1.5 rounded ${filterOptions[1] === 'all' ? 'bg-primary-100!' : ''} border-2 border-primary-200  mb-1 hover:bg-primary-600! hover:text-primary-100! text-xs!`}
                                        onClick={() => handleFilter("status", "all")}
                                    >
                                        All
                                    </div>
                                    <div
                                        className={`cursor-pointer px-2 py-1.5 rounded ${filterOptions[1] === 'Pending' ? 'bg-primary-100!' : ''} border-2 border-primary-200  mb-1 hover:bg-primary-600! hover:text-primary-100! text-xs!`}
                                        onClick={() => handleFilter("status", "Pending")}
                                    >
                                        Pending
                                    </div>
                                    <div
                                        className={`cursor-pointer px-2 py-1.5 rounded ${filterOptions[1] === 'Approved' ? 'bg-primary-100!' : ''} border-2 border-primary-200  mb-1 hover:bg-primary-600! hover:text-primary-100! text-xs!`}
                                        onClick={() => handleFilter("status", "Approved")}
                                    >
                                        Approved
                                    </div>
                                </div>
                            }
                            {filterOptions[0] === "days" &&
                                <div>
                                    <div
                                        className={`cursor-pointer px-2 py-1.5 rounded ${filterOptions[1] === 'all' ? 'bg-primary-100!' : ''} border-2 border-primary-200  mb-1 hover:bg-primary-600! hover:text-primary-100! text-xs!`}
                                        onClick={() => handleFilter("days", "all")}
                                    >
                                        All
                                    </div>
                                    <div
                                        className={`cursor-pointer px-2 py-1.5 rounded ${filterOptions[1] === 'today' ? 'bg-primary-100!' : ''} border-2 border-primary-200  mb-1 hover:bg-primary-600! hover:text-primary-100! text-xs!`}
                                        onClick={() => handleFilter("days", "today")}
                                    >
                                        Today
                                    </div>
                                    <div
                                        className={`cursor-pointer px-2 py-1.5 rounded ${filterOptions[1] === 'yesterday' ? 'bg-primary-100!' : ''} border-2 border-primary-200  mb-1 hover:bg-primary-600! hover:text-primary-100! text-xs!`}
                                        onClick={() => handleFilter("days", "yesterday")}
                                    >
                                        Yesterday
                                    </div>
                                    <div
                                        className={`cursor-pointer px-2 py-1.5 rounded ${filterOptions[1] === 'this_week' ? 'bg-primary-100!' : ''} border-2 border-primary-200  mb-1 hover:bg-primary-600! hover:text-primary-100! text-xs!`}
                                        onClick={() => handleFilter("days", "this_week")}
                                    >
                                        Thsi week
                                    </div>
                                    <div
                                        className={`cursor-pointer px-2 py-1.5 rounded ${filterOptions[1] === 'older' ? 'bg-primary-100!' : ''} border-2 border-primary-200  mb-1 hover:bg-primary-600! hover:text-primary-100! text-xs!`}
                                        onClick={() => handleFilter("days", "older")}
                                    >
                                        Older
                                    </div>
                                </div>
                            }

                            {filterOptions[0] === "property" &&
                                <div>
                                    <div
                                        className={`cursor-pointer px-2 py-1.5 rounded ${filterOptions[1] === 'all' ? 'bg-primary-100!' : ''} border-2 border-primary-200  mb-1 hover:bg-primary-600! hover:text-primary-100! text-xs!`}
                                        onClick={() => handleFilter("property", "all")}
                                    >
                                        All
                                    </div>

                                    {properties.map((prop, index) => (
                                        <div
                                            key={index}
                                            className={`cursor-pointer px-2 py-1.5 rounded ${filterOptions[1] === prop.property.id ? 'bg-primary-100!' : ''} border-2 border-primary-200  mb-1 hover:bg-primary-600! hover:text-primary-100! text-xs!`}
                                            onClick={() => handleFilter("property", prop.property.id)}
                                        >
                                            {prop.property.name}
                                        </div>
                                    ))}
                                </div>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                }
            </div>

            {applicationData.map((application) => (
                <ApplicationCard
                    key={application.id}
                    application={application}
                    userType={user}
                >
                    {user === "tenant" &&
                        <div className="flex justify-between gap-5 w-full pb-4 px-4">
                            {application.status === "Approved" ? (
                                <div className="bg-green-200 p-4 text-primary-600 grow flex items-center">
                                    <CircleCheckBig className="w-5 h-5 mr-2" />
                                    Your application has been approved
                                </div>
                            ) : application.status === "Pending" ? (
                                <div className="bg-blue-100 p-4 text-primary-600 grow flex items-center">
                                    <Clock className="w-5 h-5 mr-2" />
                                    Your application is pending approval
                                </div>
                            ) : (
                                <div className="bg-red-100 p-4 text-red-700 grow flex items-center">
                                    <XCircle className="w-5 h-5 mr-2" />
                                    Your application has been denied
                                </div>
                            )}
                        </div>
                    }
                </ApplicationCard>
            ))}
            {applicationData.length <= 0 && <div className="text-sm">No application available</div>}
        </div>
    );
};

export default ApplicationList;