"use client";

import Header from "@/components/Header";
import { AmenityEnum, HighlightEnum } from "@/lib/constants";
import React, { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"
import { AiGenerateDescriptionSuggestions, createProperty } from "../../../../lib/actions/property";
import { BotIcon, Loader2, X } from "lucide-react";
import { getAuthUser } from "@/lib/actions/user";

import { ActionState } from "../../../../lib/actions/property";
import { toast } from "sonner";

import { FilePond, registerPlugin } from "react-filepond";
import { FilePondFile } from "filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Import the Image Preview plugin
import FilePondPluginImagePreview from "filepond-plugin-image-preview";

// Register the plugin globally
registerPlugin(FilePondPluginImagePreview);

import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Label } from "@/components/ui/label";


const prevState: ActionState = { success: false, data: null, error: null, fieldErrors: null }

const NewProperty = () => {

    const [authUser, setAuthUser] = useState(null)

    const [name, setName] = useState("")
    const [description, setDescriptions] = useState("")
    const [aiLoading, setAiLoading] = useState(false)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [aiResult, setAiResult] = useState({ name: "", description: "" });

    const [tempFileStorage, setTempFileStorage] = useState<any[]>([]);

    const [pricePerM, setPricePerM] = useState(0)
    const [otherFees, setOtherFees] = useState(0)
    const [totalFees, setTotalFees] = useState(0)

    const [pets, setPets] = useState(false)
    const [parking, setParking] = useState(false)

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
        const result = pricePerM + otherFees
        setTotalFees(result)
    }, [pricePerM, otherFees])


    // Generate content or Desciption and better Title base on image
    const AiGenerateSuggestions = async (selectedMedia: File[]) => {
        setAiLoading(true)

        const fileList = selectedMedia;
        if (fileList.length === 0) {
            setAiLoading(false)
            return
        }
        // setTempFileStorage(selectedMedia)
        const MAX_IMAGE_SIZE = 1 * 1024 * 1024;
        const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

        // Define strictly allowed MIME types
        const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];
        const ALLOWED_VIDEO_TYPES = ["video/mp4"];

        const validFiles: File[] = [];
        const errorMessages: string[] = [];

        fileList.forEach((file) => {
            const isImage = file.type.startsWith("image/");
            const isVideo = file.type.startsWith("video/");

            // 1. Validate Images
            if (isImage) {
                if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
                    setAiLoading(false)
                    toast.error(`"${file.name}" is an invalid format. Only PNG, JPG, and JPEG are allowed.`, {
                        duration: Infinity,
                        action: {
                            label: "X",
                            onClick: () => { }
                        },
                    });
                    errorMessages.push(`"${file.name}" is an invalid format. Only PNG, JPG, and JPEG are allowed.`);
                    return;
                }
                if (file.size > MAX_IMAGE_SIZE) {
                    toast.error(`"${file.name}" is too large. Images must be under 5MB.`, {
                        duration: Infinity,
                        action: {
                            label: "X",
                            onClick: () => { }
                        },
                    });
                    errorMessages.push(`"${file.name}" is too large. Images must be under 5MB.`);
                    return
                }
                validFiles.push(file);
            }

            // 2. Validate Videos
            else if (isVideo) {
                if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
                    toast.error(`"${file.name}" is an invalid format. Only MP4 videos are allowed.`, {
                        duration: Infinity,
                        action: {
                            label: "X",
                            onClick: () => { }
                        },
                    });
                    errorMessages.push(`"${file.name}" is an invalid format. Only MP4 videos are allowed.`);
                    return
                }
                if (file.size > MAX_VIDEO_SIZE) {
                    toast.error(`"${file.name}" is too large. Videos must be under 50MB.`, {
                        duration: Infinity,
                        action: {
                            label: "close",
                            onClick: () => { }
                        },
                    });
                    errorMessages.push(`"${file.name}" is too large. Videos must be under 50MB.`);
                    return
                }
                validFiles.push(file);
            }

            // 3. Handle entirely unsupported files
            else {
                toast.error(`"${file.name}" is an unsupported file type.`, {
                    duration: Infinity,
                    action: {
                        label: "X",
                        onClick: () => { }
                    },
                });
                return
            }
        });

        const selectedImagesOnly = fileList.filter((file) =>
            file.type.startsWith("image/") && ALLOWED_IMAGE_TYPES.includes(file.type)
        );


        if (errorMessages.length === 0) {
            startTransition(async () => {
                const formData = new FormData();
                formData.append("name", name);

                selectedImagesOnly.forEach((fileObj) => {
                    formData.append("images", fileObj);
                });

                // Fire the updated multi-image action
                const result = await AiGenerateDescriptionSuggestions(formData);
                setAiLoading(false)
                if (result.success) {
                    setAiResult(result?.data)
                    setIsDrawerOpen(true)
                } else {
                    toast.error("Unable to generate Ai suggestion, keep trying")
                }
            });
        }

    }

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
            <div className="bg-white rounded-xl py-6 px-3 md:px-6">
                <form
                    action={formAction}
                    className="px-1 space-y-10"
                >
                    {/* Basic Information */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                        <div className="space-y-4">
                            <Input name='managerId' type="hidden" defaultValue={authUser?.data?.id} />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className='text-sm font-semibold mb-2 block text-primary-600'>Property Type</label>
                                    <select className='w-full p-2 shadow text-primary-700 m-0 text-sm' name='propertyType' required>
                                        <option value="room">Single Room</option>
                                        <option value="two rooms">Two Rooms</option>
                                        <option value="self contain">Self Contain</option>
                                        <option value="flat">Flat</option>
                                        <option value="boys squaters">Boys Squaters</option>
                                    </select>
                                </div>

                                <div>
                                    <label className='text-sm font-semibold mb-2 block text-primary-600'>Property name</label>
                                    <Input onChange={(e) => setName(e.target.value)} name='name' placeholder="e.g Main checking" value={name} className="border-0 shadow text-sm  focus:border-2 focus:border-secondary-800" />
                                    {state.fieldErrors?.name && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.name}</p>}
                                </div>
                            </div>

                            {/* Photos */}
                            <div>
                                <div className='text-sm font-semibold mb-2 text-primary-600 flex justify-between'><span>Property Photos</span> {aiResult.name !== "" && <div onClick={() => setIsDrawerOpen(true)} className="bg-blue-400 p-1 rounded cursor-pointer"><BotIcon size={15} className="text-white" /></div>} </div>
                                <FilePond
                                    onupdatefiles={(fileItems) => {
                                        // 1. Extract valid browser File objects safely
                                        const rawFiles = fileItems
                                            .map((item) => item.file)
                                            .filter((file): file is File => file instanceof File);

                                        // 2. Pass the fresh batch array directly to your async function
                                        setTempFileStorage(rawFiles)
                                        AiGenerateSuggestions(rawFiles);
                                    }}
                                    // Enable multiple files
                                    allowMultiple={true}
                                    maxFiles={5}

                                    // Restrict to images and videos only
                                    acceptedFileTypes={["image/*", "video/*"]}
                                    storeAsFile={true}
                                    // UI Configurations
                                    name="photoUrls"
                                    labelIdle='Drag & Drop your images/videos or <span class="filepond--label-action">Browse</span>'
                                    imagePreviewMaxHeight={200}

                                />
                                {state.fieldErrors?.photoUrls && <p className='text-primary-700 mt-1 text-sm flex gap-1 items-center'>{state.fieldErrors?.photoUrls}</p>}
                                {/* <input
                                    onChange={AiGenerateSuggestions}
                                    type="file" ref={inputRef} multiple
                                    accept="image/*" name='photoUrls'
                                    className='hidden' />
                                <button
                                    type="button"
                                    disabled={aiLoading}
                                    onClick={() => { inputRef.current?.click() }}
                                    className='flex justify-center w-full px-4 py-2 rounded bg-primary-200 cursor-pointer items-center font-medium shadow-md text-sm'> {aiLoading ? <Loader2 className="transform animate-spin" /> : "Click to select Photos"}  </button>
                                {state.fieldErrors?.photoUrls && <p className='text-primary-700 mt-1 text-sm flex gap-1 items-center'>{state.fieldErrors?.photoUrls}</p>} */}
                            </div>


                            <div className="mb-2">
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Description</label>
                                <Textarea onChange={(e) => setDescriptions(e.target.value)} name="description" value={description} className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" placeholder="e.g A nice flat..." />
                                {state.fieldErrors?.description && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.description}</p>}
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />


                    {/* Property Details */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold mb-4">Property Details <span className="text-xs">(Optional)</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Number of Beds</label>
                                <Input type="number" name='beds' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" min={0} max={10} />
                                {state.fieldErrors?.beds && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.beds}</p>}
                            </div>
                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Number of Baths</label>
                                <Input type="number" name='baths' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" min={0} max={10} />
                                {state.fieldErrors?.baths && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.baths}</p>}
                            </div>
                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Square Feet</label>
                                <Input type="number" name='squareFeet' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" min={0} />
                                {state.fieldErrors?.squareFeet && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.squareFeet}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Pets Allowed</label>
                                <Switch
                                    checked={pets}
                                    onCheckedChange={() => setPets(!pets)}
                                    className="cursor-pointer bg-primary-300 data-[state=unchecked]:bg-primary-300 data-[state=checked]:bg-secondary-800" />
                                <input type="hidden" name='isPetsAllowed' defaultValue={pets} />
                            </div>

                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Parking Included</label>
                                <Switch
                                    checked={parking}
                                    onCheckedChange={() => setParking(!parking)}
                                    className="cursor-pointer data-[state=unchecked]:bg-primary-300 data-[state=checked]:bg-secondary-800" />
                                <input type="hidden" name='isParkingIncluded' defaultValue={parking} />
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />

                    {/* Amenities and Highlights */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">
                            Amenities and Highlights <span className="text-xs">(Optional)</span>
                        </h2>
                        <div className="space-y-6">
                            <div className='mb-4'>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Amenities</label>
                                <div className='flex flex-wrap gap-2 md:grid md:grid-cols-4 p-2  shadow text-primary-700 m-0'>
                                    {Object.values(AmenityEnum).map((item) => {
                                        return (
                                            <div key={item} className="flex items-center space-x-3">
                                                <Checkbox
                                                    id={item}
                                                    name="amenities"
                                                    value={item}

                                                    className="data-[state=checked]:bg-secondary-800 data-[state=checked]:text-white"
                                                />
                                                <Label htmlFor={item}
                                                    className="text-sm font-normal normal-case cursor-pointer select-none">
                                                    {item}
                                                </Label>
                                            </div>
                                        )
                                    })}
                                </div>
                                {state.fieldErrors?.amenities && <p className='text-primary-700 mt-1 text-sm flex gap-1 items-center'>{state.fieldErrors?.amenities}</p>}
                            </div>

                            <div className='mb-4'>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Highlights</label>
                                <div className='flex flex-wrap gap-2 md:grid md:grid-cols-4 p-2  shadow text-primary-700 m-0'>
                                    {Object.values(HighlightEnum).map((item) => {
                                        return (
                                            <div key={item} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={item}
                                                    name="highlights"
                                                    value={item}
                                                    className="data-[state=checked]:bg-secondary-800 data-[state=checked]:text-white"
                                                />
                                                <Label htmlFor={item}
                                                    className="text-sm font-normal normal-case cursor-pointer select-none">
                                                    {item}
                                                </Label>
                                            </div>
                                        )
                                    })}
                                </div>
                                {state.fieldErrors?.highlights && <p className='text-primary-700 mt-1 text-sm flex gap-1 items-center'>{state.fieldErrors?.highlights}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Fees */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold mb-4">Fees</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Price per Month</label>
                                <Input onChange={(e) => setPricePerM(Number(e.target.value))} type="number" name='pricePerMonth' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" min={0} required />
                                {state.fieldErrors?.pricePerMonth && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.pricePerMonth}</p>}
                            </div>

                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Other Fees</label>
                                <Input onChange={(e) => setOtherFees(Number(e.target.value))} type="number" name='otherFees' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" min={0} required />
                                {state.fieldErrors?.otherFees && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.otherFees}</p>}
                            </div>
                        </div>


                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label onClick={() => AiGenerateSuggestions(tempFileStorage)} className='text-sm font-semibold mb-2 block text-primary-600'>Total Amount</label>
                                <Input type="text" name='totalFee' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" min={0} value={totalFees} readOnly required />
                            </div>
                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Application Fee</label>
                                <Input type="number" name='applicationFee' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" defaultValue={50} readOnly min={0} required />
                                {state.fieldErrors?.applicationFee && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.applicationFee}</p>}
                            </div>
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200" />


                    {/* Locatioon Information */}
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold mb-4">
                            Location
                        </h2>

                        <div>
                            <label className='text-sm font-semibold mb-2 block text-primary-600'>Address</label>
                            <Input type="text" name='address' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" required />
                            {state.fieldErrors?.address && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.address}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>State</label>
                                <Input type="text" name='state' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" required />
                                {state.fieldErrors?.state && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.state}</p>}
                            </div>
                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>City</label>
                                <Input type="text" name='city' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" required />
                                {state.fieldErrors?.city && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.city}</p>}
                            </div>
                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Postal Code</label>
                                <Input type="text" name='postalCode' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" required />
                                {state.fieldErrors?.postalCode && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.postalCode}</p>}
                            </div>
                            <div>
                                <label className='text-sm font-semibold mb-2 block text-primary-600'>Country</label>
                                <Input type="text" name='country' className="border-0 shadow text-sm focus:border-2 focus:border-secondary-800" required />
                                {state.fieldErrors?.country && <p className="text-xs mt-2 md:max-w-[250px] font-semibold text-red-400">{state.fieldErrors.country}</p>}
                            </div>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="bg-secondary-800 text-white w-full mt-5 cursor-pointer">
                        {isPending ? <Loader2 className="animate-spin" /> : "Create Property"}
                    </Button>
                </form>
            </div>

            {/* Ai Name and Description suggestion drawer*/}
            <Drawer direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                <DrawerContent>
                    <div className="h-screen mx-auto flex flex-col justify-between w-full max-w-2xl overflow-y-auto">
                        <DrawerHeader className="py-3 px-5 bg-primary-700">
                            <DrawerTitle className="text-primary-100 flex gap-1 items-center"><BotIcon className="size-5" /> <span>Ha<span className="text-secondary-700">li</span></span>  </DrawerTitle>
                            <DrawerDescription className="text-xs text-primary-400">
                                Custom bot from Owners providing basic assistance
                            </DrawerDescription>
                        </DrawerHeader>

                        {aiLoading ? <><div className="sand-500 px-5 transform animate-bounce">Think<span className="text-secondary-700">ing...</span></div></> :
                            (
                                <div className="mt-4 px-5 sand-500 text-sm">
                                    <div>Hey th<span className="text-secondary-800">ere!</span></div>
                                    <div>Base on the images you've selected, I have suggested a name and description for your post.
                                        <br />Click the apply button  to accept suggstions.
                                    </div>
                                    <div className="mt-5">
                                        <div>
                                            <div className="px-3 py-2 rounded bg-primary-100">
                                                <span className="text-xs font-semibold text-primary-600">Property Name</span>
                                                <div>{aiResult.name}</div>
                                            </div>
                                            <button onClick={() => {
                                                setName(aiResult.name)
                                                toast.success("Name Applied")
                                            }}
                                                className="bg-blue-400 hover:bg-blue-500 transition-all duration-300 cursor-pointer px-3 py-1 text-xs rounded text-white mt-1.5">Apply</button>
                                        </div>

                                        <div className="mt-4">
                                            <div className="px-3 py-2 rounded bg-primary-100">
                                                <span className="text-xs font-semibold text-primary-600">Property Description</span>
                                                <div className="h-[150px] no-scrollbar overflow-y-auto mt-1">{aiResult.description}</div>
                                            </div>
                                            <button onClick={() => {
                                                setDescriptions(aiResult.description)
                                                toast.success("Description Applied")
                                            }}
                                                className="bg-blue-400 hover:bg-blue-500 transition-all duration-300 cursor-pointer px-3 py-1 text-xs rounded text-white mt-1.5 ">Apply</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                        <DrawerFooter className="bg-primary-700 mt-4 px-5 py-2">
                            <div className="flex gap-5 justify-end text-sm">
                                <button disabled={aiLoading} onClick={() => AiGenerateSuggestions(tempFileStorage)} className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 cursor-pointer px-3 flex gap-1 items-center py-1 rounded text-white mt-1.5"> {aiLoading ? <Loader2 className="transform animate-spin" /> : <>Retry <BotIcon size={17} /></>}</button>
                                <DrawerClose asChild className="cursor-pointer ">
                                    <button className="text-primary-100 flex border gap-1 px-3 py-1 rounded mt-1.5 items-center justify-center">Close <X size={16} /></button>
                                </DrawerClose>
                            </div>
                        </DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
};

export default NewProperty;