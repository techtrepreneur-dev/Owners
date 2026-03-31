"use client";

import Header from "@/components/Header";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import React, { useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createProperty } from "../../../../lib/actions/property";
import { Loader2 } from "lucide-react";
import { getAuthUser } from "@/lib/actions/user";

import { ActionState } from "../../../../lib/actions/property";
import { toast } from "sonner";

const prevState: ActionState = { success: false, data: null, error: null, fieldErrors: null }

const NewProperty = () => {

    const [pets, setPets] = useState(false)
    const [parking, setParking] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const [authUser, setAuthUser] = useState(null)

    const [state, formAction, isPending] = useActionState(createProperty, prevState)


    useEffect(() => {
        const getAuth = async () => {
            try {
                const result = await getAuthUser()
                setAuthUser(result);
            } catch (err) {
                setAuthUser(null)
            }
        };

        getAuth();
    }, [])


    useEffect(() => {
        if (state.success) {
            toast.success("New property created!")
        } else if (!state.success && state.error !== null) {
            toast.error(state.error)
        }
    }, [state])

    return (
        <div className="dashboard-container">
            <Header
                title="Add New Property"
                subtitle="Create a new property listing with detailed information"
            />
            <div className="bg-white rounded-xl p-6">
                <form
                    action={formAction}
                    className="p-4 space-y-10"
                >
                    {/* Basic Information */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <Input name='managerId' type="hidden" defaultValue={authUser?.data?.id} />
                            <div className="mb-4">
                                <label className='text-sm font-semibold mb-2 block'>Property name</label>
                                <Input name='name' placeholder="e.g Main checking" className="border-0 shadow text-sm" />
                                {state.fieldErrors?.name && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.name}</p>}
                            </div>
                            <div className="mb-2">
                                <label className='text-sm font-semibold mb-2 block'>Description</label>
                                <Textarea placeholder="e.g A nice flat..." className="border-0 shadow text-sm" name="description" />
                                {state.fieldErrors?.description && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.description}</p>}
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    {/* Fees */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold mb-4">Fees</h2>

                        <div className="mb-4">
                            <label className='text-sm font-semibold mb-2 block'>Price per Month</label>
                            <Input type="number" name='pricePerMonth' placeholder="e.g Main checking" className="border-0 shadow text-sm" min={0} />
                            {state.fieldErrors?.pricePerMonth && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.pricePerMonth}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className='text-sm font-semibold mb-2 block'>Security Deposit</label>
                                <Input type="number" name='securityDeposit' className="border-0 shadow text-sm" min={0} />
                                {state.fieldErrors?.securityDeposit && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.securityDeposit}</p>}
                            </div>
                            <div>
                                <label className='text-sm font-semibold mb-2 block'>Application Fee</label>
                                <Input type="number" name='applicationFee' className="border-0 shadow text-sm" min={0} />
                                {state.fieldErrors?.applicationFee && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.applicationFee}</p>}
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    {/* Property Details */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold mb-4">Property Details <span className="text-xs">(Optional)</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className='text-sm font-semibold mb-2 block'>Number of Beds</label>
                                <Input type="number" name='beds' className="border-0 shadow text-sm" min={0} max={10} />
                                {state.fieldErrors?.beds && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.beds}</p>}
                            </div>
                            <div>
                                <label className='text-sm font-semibold mb-2 block'>Number of Baths</label>
                                <Input type="number" name='baths' className="border-0 shadow text-sm" min={0} max={10} />
                                {state.fieldErrors?.baths && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.baths}</p>}
                            </div>
                            <div>
                                <label className='text-sm font-semibold mb-2 block'>Square Feet</label>
                                <Input type="number" name='squareFeet' className="border-0 shadow text-sm" min={0} />
                                {state.fieldErrors?.squareFeet && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.squareFeet}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className='text-sm font-semibold mb-2 block'>Pets Allowed</label>
                                <Switch
                                    checked={pets}
                                    onCheckedChange={() => setPets(!pets)}
                                    className="cursor-pointer bg-primary-300 data-[state=unchecked]:bg-primary-300 data-[state=checked]:bg-primary-700" />
                                <input type="hidden" name='isPetsAllowed' defaultValue={pets} />
                            </div>

                            <div>
                                <label className='text-sm font-semibold mb-2 block'>Parking Included</label>
                                <Switch
                                    checked={parking}
                                    onCheckedChange={() => setParking(!parking)}
                                    className="cursor-pointer data-[state=unchecked]:bg-primary-300 data-[state=checked]:bg-primary-700" />
                                <input type="hidden" name='isParkingIncluded' defaultValue={parking} />
                            </div>
                        </div>
                        {/* <div className="mt-4">
                            <CustomFormField
                                name="propertyType"
                                label="Property Type"
                                type="select"
                                options={Object.keys(PropertyTypeEnum).map((type) => ({
                                    value: type,
                                    label: type,
                                }))}
                            />
                        </div> */}
                    </div>

                    <hr className="my-6 border-gray-200" />

                    {/* Amenities and Highlights */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">
                            Amenities and Highlights <span className="text-xs">(Optional)</span>
                        </h2>
                        <div className="space-y-6">
                            <div className='mb-4'>
                                <label className='text-sm font-semibold mb-2 block'>Amenities</label>
                                <select className='w-full p-2 shadow text-gray-700 m-0' name='amenities' multiple>
                                    {Object.values(AmenityEnum).map((item) => (
                                        <option value={item} key={item} className="text-xs mb-2">{item}</option>
                                    ))}
                                </select>
                                {state.fieldErrors?.amenities && <p className='text-gray-700 mt-1 text-sm flex gap-1 items-center'>{state.fieldErrors?.amenities}</p>}
                            </div>

                            <div className='mb-4'>
                                <label className='text-sm font-semibold mb-2 block'>Highlights</label>
                                <select className='w-full p-2 shadow text-gray-700 m-0' name='highlights' multiple>
                                    {Object.values(HighlightEnum).map((item) => (
                                        <option value={item} key={item} className="text-xs mb-2">{item}</option>
                                    ))}
                                </select>
                                {state.fieldErrors?.highlights && <p className='text-gray-700 mt-1 text-sm flex gap-1 items-center'>{state.fieldErrors?.highlights}</p>}
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    {/* Photos */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Photos</h2>
                        <div>
                            <div className='text-sm font-semibold mb-2 block'>Property Photos</div>
                            <input
                                type="file" ref={inputRef} multiple
                                accept="image/*" name='photoUrls'
                                className='hidden' />
                            <div
                                onClick={() => { inputRef.current?.click() }}
                                className='px-4 py-2 rounded bg-primary-200 cursor-pointer items-center font-medium shadow-md text-center text-sm'>Click to select Photos </div>
                            {state.fieldErrors?.photoUrls && <p className='text-gray-700 mt-1 text-sm flex gap-1 items-center'>{state.fieldErrors?.photoUrls}</p>}
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    {/* Additional Information */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Additional Information
                        </h2>

                        <div>
                            <label className='text-sm font-semibold mb-2 block'>Address</label>
                            <Input type="text" name='address' className="border-0 shadow text-sm" />
                            {state.fieldErrors?.address && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.address}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <label className='text-sm font-semibold mb-2 block'>City</label>
                                <Input type="text" name='city' className="border-0 shadow text-sm" />
                                {state.fieldErrors?.city && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.city}</p>}
                            </div>

                            <div>
                                <label className='text-sm font-semibold mb-2 block'>State</label>
                                <Input type="text" name='state' className="border-0 shadow text-sm" />
                                {state.fieldErrors?.state && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.state}</p>}
                            </div>
                            <div>
                                <label className='text-sm font-semibold mb-2 block'>Postal Code</label>
                                <Input type="text" name='postalCode' className="border-0 shadow text-sm" />
                                {state.fieldErrors?.postalCode && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.postalCode}</p>}
                            </div>
                            <div>
                                <label className='text-sm font-semibold mb-2 block'>Country</label>
                                <Input type="text" name='country' className="border-0 shadow text-sm" />
                                {state.fieldErrors?.country && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.country}</p>}
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="bg-primary-700 text-white w-full mt-8 cursor-pointer">
                        {isPending ? <Loader2 className="animate-spin" /> : "Create Property"}
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default NewProperty;