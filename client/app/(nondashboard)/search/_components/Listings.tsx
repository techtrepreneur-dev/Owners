"use client"

import { useAppSelector } from "@/state/store";
import { Property } from "@/lib/types/prismaTypes";
import Card from "@/components/Card";
import React, { startTransition, useActionState, useEffect, useState } from "react";
import CardCompact from "@/components/CardCompact";
import { cleanParams } from "@/lib/utils";
import { getProperties } from "@/lib/actions/property";
import { getAuthUser } from "@/lib/actions/user";
import { addFavourite, getTenent, removeFavourite } from "@/lib/actions/tenant";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Listings = () => {

    const viewMode = useAppSelector((state) => state.global.viewMode);
    const filters = useAppSelector((state) => state.global.filters);
    const [properties, setProperties] = useState([])
    const [authUser, setAuthUser] = useState(null)
    const [tenant, setTenant] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [action, setAction] = useState(false)
    useEffect(() => {
        const getAuth = async () => {
            try {
                const result = await getAuthUser()
                setAuthUser(result);
            } catch {
                setAuthUser(null)
            }
        };

        getAuth();
    }, [])

    useEffect(() => {
        const getTenantUser = async () => {
            try {
                if (authUser) {
                    const id = authUser?.data?.id
                    const result = await getTenent(id)
                    setTenant(result?.data);
                }
            } catch {
                setTenant(null)
            }
        };

        getTenantUser();
    }, [authUser])

    useEffect(() => {
        const params = cleanParams(filters)
        const getAvailableProperties = async () => {
            try {
                setIsLoading(true)
                const result = await getProperties(params)
                setProperties(result.data);
                setIsLoading(false)
            } catch {
                setProperties([])
            }
        };
        getAvailableProperties();
    }, [filters])


    const [addState, addAction, isAddPending] = useActionState(addFavourite, null)
    const [removeState, removeAction, isRemovePending] = useActionState(removeFavourite, null)

    const handleFavoriteToggle = async (propertyId) => {

        const isFavorite = tenant?.favorites?.some(
            (fav: Property) => fav.id === propertyId
        );

        if (isFavorite) {
            startTransition(() => {
                removeAction({ tenantId: tenant?.id, propertyId: propertyId })
            })
        } else {
            startTransition(() => {
                addAction({ tenantId: tenant?.id, propertyId: propertyId })
            })
        }
    }

    useEffect(() => {
        if (addState?.success) {
            setTenant(addState.data)
            toast.success("Added to favourite")
        }
    }, [addState?.success, addState?.data])

    useEffect(() => {
        if (removeState?.success) {
            setTenant(removeState.data)
            toast.success("Removed from favourite")
        }
    }, [removeState?.success, removeState?.data])


    if (properties.length === 0 && !isLoading) return <div className="p-2 bg-red-300 text-sm rounded-md text-center text-white/80">!Sorry, No property matches your search</div>;

    return (
        <div className="w-full">
            <h3 className="text-sm px-4 font-bold flex gap-2 items-center">
                {isLoading ? <><Loader2 className="animate-spin" /></> : properties.length}
                <span className="text-gray-700 font-normal">
                    Places in {filters.location}
                </span>
            </h3>
            <div className="flex">
                <div className="p-4 w-full">
                    {properties?.map((property) =>
                        viewMode === "grid" ? (
                            <Card
                                key={property.id}
                                property={property}
                                isFavorite={
                                    tenant?.favorites?.some(
                                        (fav: Property) => fav.id === property.id
                                    ) || false
                                }
                                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                                showFavoriteButton={!!authUser}
                                propertyLink={`/search/${property.id}`}
                            />
                        ) : (
                            <CardCompact
                                key={property.id}
                                property={property}
                                isFavorite={
                                    tenant?.favorites?.some(
                                        (fav: Property) => fav.id === property.id
                                    ) || false
                                }
                                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                                showFavoriteButton={!!authUser}
                                propertyLink={`/search/${property.id}`}
                            />
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default Listings;