import Card from "@/components/Card";
import Header from "@/components/Header";
import { getManagerProperties } from "@/lib/actions/manager";
import { getAuthUser } from "@/lib/actions/user";
import { Coins, HomeIcon, Paperclip, TrophyIcon } from 'lucide-react'
import React from "react";
import PendingApplications from "./_components/PendingApplications";
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
        <div className="dashboard-container">
            <Header
                title="Overview"
                subtitle=""
            />

            {/* overview */}
            <section className='grid grid-cols-1 grid-flow-row sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-[32px] md:gap-x-[30px] max-w-full'>
                <div className="w-full md:basis-[20%] border-t-4 border-t-secondary-800 bg-white rounded-[10px] px-[22px] py-[18px]  shadow">
                    <div className="flex justify-between items-center">
                        <p className='text-xs text-primary-600 tracking-[1.5px]'>Active Earnings</p> <span><Coins className="text-secondary-800" /></span>
                    </div>
                    <div className='text-2xl sand-600 mt-2'>N23,300</div>
                </div>

                <div className="w-full md:basis-[20%] border-t-4 border-t-blue-500 bg-white rounded-[10px] px-[22px] py-[18px]  shadow">
                    <div className="flex justify-between items-center">
                        <p className='text-xs text-primary-600 tracking-[1.5px]'>Active Properties</p> <span><HomeIcon className="text-blue-500" /></span>
                    </div>
                    <div className='text-2xl sand-600 mt-2'>10</div>
                </div>

                <div className="w-full md:basis-[20%] border-t-4 border-t-secondary-800 bg-white rounded-[10px] px-[22px] py-[18px]  shadow">
                    <div className="flex justify-between items-center">
                        <p className='text-xs text-primary-600 tracking-[1.5px]'>Pending Applications</p> <span><Paperclip className="text-secondary-800" /></span>
                    </div>
                    <div className='text-2xl sand-600 mt-2'>100</div>
                </div>

                <div className="w-full md:basis-[20%] border-t-4 border-t-blue-500 bg-white rounded-[10px] px-[22px] py-[18px]  shadow">
                    <div className="flex justify-between items-center">
                        <p className='text-xs text-primary-600 tracking-[1.5px]'>Tier</p> <span><TrophyIcon className="text-blue-500" /></span>
                    </div>
                    <div className='text-2xl sand-600 mt-2'>1</div>
                </div>
            </section>

            <div className="h-full bg-primary-100 rounded-4xl shadow-sm border border-gray-100 mt-10 -m-5 p-5">
                <div className="flex flex-wrap md:flex-nowrap justify-between gap-8">
                    {/* active properties */}
                    <div className="w-full md:w-8/12">
                        <Header
                            title="Active Properties"
                            subtitle="Browse and manage your property listings"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
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

                    {/* pending applications */}
                    <div className="w-full md:w-4/12 rounded-2xl">
                        <PendingApplications />
                    </div>
                </div>

            </div>

        </div>
    );
};

export default page;