"use client"
import { approveApplication, cancleApplication } from "@/lib/actions/application";
import { Check, CheckCheckIcon, Clock, Loader2, Mail, MapPin, PhoneCall, UserCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { startTransition, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { ConfirmActionDialog } from "./ConfirmActionDialog";
import { useRouter } from "next/navigation";


const ApplicationCard = ({
    application,
    userType,
    children,
}: ApplicationCardProps) => {

    const [appData, setAppData] = useState(application)
    const [state, action, isPending] = useActionState(approveApplication, null)
    const [cancleState, cancleAction, isCanclePending] = useActionState(cancleApplication, null)
    const [dialogOpen, setDialogOpen] = useState(false)

    const router = useRouter()


    const [imgSrc, setImgSrc] = useState(
        application.property.photoUrls?.[0] || "/placeholder.jpg"
    );

    const contactPerson =
        userType === "manager" ? application.tenant : application.property.manager;

    const dateObject = new Date(application.createdAt);
    const dateTime = dateObject.toLocaleTimeString('en-US', {
        year: 'numeric',
        month: 'short',  // "Jan", "Feb", "Jun", etc.
        day: '2-digit',   // "01", "02", etc.
        hour: '2-digit',  // "16"
        minute: '2-digit',// "19"
        hour12: false     // Use true for AM/PM
    });

    useEffect(() => {
        if (state?.success) {
            setAppData(state.data)

            toast.success("Application approved", {
                duration: Infinity,
                action: {
                    label: "X",
                    onClick: () => { }
                },
            })
        }
    }, [state])

    useEffect(() => {
        if (cancleState?.success) {
            setAppData(cancleState.data)

            toast.success(`Application ${userType === "tenant" ? "Deleted" : "Denied"} `, {
                duration: Infinity,
                action: {
                    label: "x",
                    onClick: () => { }
                },
            })
        }
    }, [cancleState, router])


    const acceptApplication = async (applicationId: string) => {
        startTransition(() => {
            action(applicationId)
        })
    }

    const cancleApp = async (applicationId: string, user: string) => {
        startTransition(() => {
            cancleAction({ id: applicationId, userType: user })
        })
        setDialogOpen(false)
    }


    return (
        <div className="border border-primary-200 rounded-xl overflow-hidden shadow-sm bg-white mb-5 sand-500">
            <div className="flex flex-col lg:flex-row  items-start lg:items-center px-6 md:px-4 pb-6  gap-6 lg:gap-20">
                {/* Property Info Section */}
                <div className="w-full md:w-auto">
                    <div className="my-2 flex justify-end md:justify-start">
                        <div className="text-xs inline-block rounded bg-primary-100 border border-primary-200 p-1">{dateTime}</div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-5 w-full lg:w-auto">
                        <Image
                            src={imgSrc}
                            alt={application.property.name}
                            width={200}
                            height={150}
                            className="rounded-xl object-cover w-full lg:w-[200px] h-[150px]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            onError={() => setImgSrc("/placeholder.jpg")}
                        />
                        <div className="flex flex-col ">
                            <div>
                                <h2 className="text-xl font-bold my-2">
                                    <Link
                                        href={`/ search / ${application.property.id} `}
                                        className="hover:text-secondary-800"
                                    >
                                        {application.property.name}
                                    </Link>
                                </h2>
                                <div className="flex items-center mb-2 text-sm">
                                    <MapPin className="w-5 h-5 mr-1" />
                                    <span>{`${application.property.location.city}, ${application.property.location.country} `}</span>
                                </div>
                            </div>
                            <div className="font-semibold mt-3 md:mt-5 flex items-center">
                                <Image src="/naira-gray.png" alt="" width={1000} height={1000} className="w-4 h-4" />
                                <div className="text-primary-600">{application.property.pricePerMonth}{" "}<span className="text-sm font-normal"> / month</span></div>
                            </div>
                            <div className="text-lg font-semibold flex items-center text-primary-600">
                                <Image src="/naira-gray.png" alt="" width={1000} height={1000} className="w-4 h-4" />
                                <div>{application.property.totalFee}{" "}<span className="text-sm font-normal">/ Total</span></div>
                            </div>
                        </div>
                    </div>

                    {/* status and button */}
                    {userType === "tenant" && (
                        <div className="flex gap-5 items-center mt-4">
                            {appData.status === "Approved" &&
                                <span className={`px-2 py-1 bg-green-600 border-green-600 border-2 flex gap-1 items-center text-white rounded text-xs`}>
                                    {appData.status} <Check size={15} />
                                </span>
                            }
                            {appData.status === "Pending" &&
                                <span className={`px-2 py-1 bg-blue-400 border-blue-400 border-2 flex gap-1 items-center text-white rounded text-xs`}>
                                    {appData.status} <Clock size={13} />
                                </span>
                            }
                            {appData.status === "Denied" &&
                                <span className={`px-2 py-1 bg-red-400 border-red-400 border-2 flex gap-1 items-center text-white rounded text-xs`}>
                                    {appData.status} <XCircle size={13} />
                                </span>
                            }

                            {(appData.status === "Pending" || appData.status === "Approved") &&
                                <button
                                    onClick={() => setDialogOpen(true)}
                                    className={`px-2 py-1 border-2 border-red-400 text-red-500 flex gap-1 cursor-pointer items-center rounded text-xs`}
                                >
                                    Cancle {isCanclePending ? <Loader2 size={14} className="transform animate-spin" /> : <XCircle size={12} />}
                                </button>
                            }

                            {appData.status === "Denied" &&
                                <button
                                    onClick={() => cancleApp(appData.id, userType)}
                                    className={`px-2 py-1 border-2  border-primary-300  bg-primary-300 flex gap-1 cursor-pointer items-center rounded text-xs`}
                                >
                                    Delete {isCanclePending ? <Loader2 size={14} className="transform animate-spin" /> : ""}
                                </button>
                            }

                            {dialogOpen && <ConfirmActionDialog
                                state={{ open: dialogOpen, action: setDialogOpen }}
                                text={{ header: "Cancle Application", description: "Cancling application will delete it and agent will not receive it." }}
                                action={() => cancleApp(application.id, userType)} />}
                        </div>
                    )}
                </div>


                {/* Divider - visible only on desktop */}
                <div className="hidden lg:block border-[0.5px] border-primary-200 h-48" />

                {/* Contact Person Section */}
                <div className="flex flex-col justify-start gap-5 w-full lg:basis-3/12 lg:h-48 pt-2">
                    <div className="mt-3">
                        <div className="text-lg font-semibold flex justify-between gap-2 items-center">
                            <div className="flex gap-2 items-center"><UserCircle className="text-primary-500" /> {userType === "manager" ? "Tenant" : "Agent Contact"} </div>
                            {userType === "manager" && <div className="flex items-center bg-primary-100 gap-1 text-primary-600 py-1 px-2 rounded border text-xs border-primary-200">{appData.status} {appData.status === "Approved" ? <Check size={15} /> : <Clock size={13} />} </div>}
                        </div>
                        <hr className="mt-1 text-primary-300" />
                    </div>
                    <div className="flex gap-4">
                        {userType === "tenant" &&
                            <>
                                {(appData.status === "Pending" || appData.status === "Denied") ? (
                                    <>
                                        <div>
                                            <UserCircle className="text-secondary-800" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="font-medium text-sm">
                                                Agent contact will be available when your application is approved
                                            </div>
                                        </div>
                                    </>) : (
                                    <>
                                        <div>
                                            <Image
                                                src="/landing-i1.png"
                                                alt={contactPerson.firstName}
                                                width={40}
                                                height={40}
                                                className="rounded-full border-3 border-secondary-800 mr-2 min-w-[45px] min-h-[45px]"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="font-semibold">{contactPerson.firstName} {contactPerson.lastName}</div>
                                            <div className="text-sm flex items-center text-primary-600">
                                                <PhoneCall className="w-5 h-5 mr-2" />
                                                {contactPerson.phone}
                                            </div>
                                            <div className="text-sm flex items-center text-primary-600">
                                                <Mail className="w-5 h-5 mr-2" />
                                                {contactPerson.email}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        }
                        {userType === "manager" && (
                            <>
                                <div>
                                    <Image
                                        src="/landing-i1.png"
                                        alt={contactPerson.firstName}
                                        width={40}
                                        height={40}
                                        className="rounded-full border-3 border-secondary-800 mr-2 min-w-[45px] min-h-[45px]"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="font-semibold">{application.name}</div>
                                    {appData.status === "Approved" ?
                                        <div>
                                            <div className="text-sm flex items-center mb-2 text-primary-600">
                                                <PhoneCall className="w-5 h-5 mr-2" />
                                                {contactPerson.phone}
                                            </div>
                                            <div className="text-sm flex items-center text-primary-600">
                                                <Mail className="w-5 h-5 mr-2" />
                                                {contactPerson.email}
                                            </div>
                                        </div>
                                        : <div className="font-medium text-sm">
                                            Accept this application to see its contact info
                                        </div>
                                    }
                                </div>
                            </>
                        )}
                    </div>

                    {/* status and button */}
                    {userType === "manager" && (
                        <div className="flex gap-5 items-center mt-1 mb-3">
                            {appData.status !== "Approved" && (
                                <button
                                    onClick={() => acceptApplication(application.id)}
                                    className={`px-2 py-1 bg-secondary-800 cursor-pointer border-2 border-secondary-800 flex gap-1 items-center text-white rounded text-xs`}
                                >
                                    Accept {isPending ? <Loader2 className="transform animate-spin" size={13} /> : <Clock size={13} />}
                                </button>
                            )}

                            {appData.status === "Approved" && (
                                <button
                                    // onClick={() => acceptApplication(application.id)}
                                    className={`px-2  py-1 bg-primary-700 cursor-pointer border-2 border-secondary-800 flex gap-1 items-center text-white rounded text-xs`}>
                                    Close  <CheckCheckIcon size={13} />
                                </button>
                            )}

                            <button
                                onClick={() => setDialogOpen(true)}
                                className={`px-2 py-1 border-2 border-red-400 text-red-500 flex gap-1 cursor-pointer items-center rounded text-xs`}>
                                Deline {isCanclePending ? <Loader2 className="transform animate-spin" size={13} /> : <XCircle size={12} />}
                            </button>
                            {dialogOpen && <ConfirmActionDialog
                                state={{ open: dialogOpen, action: setDialogOpen }}
                                text={{ header: "Decline Application", description: "Decling application will remove it from your list permanently." }}
                                action={() => cancleApp(application.id, userType)} />}
                        </div>
                    )}
                </div>
            </div>

            {userType === "tenant" && <hr className="mb-4 text-primary-300" />}
            {children}
        </div>
    );
};

export default ApplicationCard;