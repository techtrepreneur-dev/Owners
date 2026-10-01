"use client"
import { Mail, MapPin, PhoneCall } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function ProfileDetails() {

    const [view, setView] = useState("profile")



    return (
        <div className="flex gap-5  flex-wrap md:flex-nowrap">
            <div className="w-full md:w-4/12 ">
                <div className='p-2 shadow-sm bg-white relative'>
                    <div className="absolute left-0 top-0 bg-secondary-800 h-[150px] w-full block z-1" style={{ clipPath: "polygon(100% 0, 100% 50%, 100% 100%, 50% 57%, 0 100%, 0% 0%)" }}></div>
                    <div className="flex justify-center mt-2 relative z-2"><div className="border-3 p-[3px] border-primary-300 inline-block rounded-full bg-white"><Image src="/profile.jpeg" alt="" width={1000} height={1000} className=' w-[100px] h-[100px] rounded-full' /></div></div>
                    <div className="text-lg mt-3 text-center sand-700">Hanna Miller</div>
                    <div className='flex justify-center items-center'><Image src="/bronze-star.png" alt="" width={1000} height={1000} className='w-8' /> <span className='sand-600'>Tier 1</span></div>
                </div>

                <div className='px-6 py-3 mt-3 shadow-sm bg-primary-50 sand-500'>
                    {/* <div className="flex items-center gap-2 pb-2 mb-2 border-b border-b-primary-200"><User className='text-primary-600 size-5' /> <span>First Name: Hanna</span></div>
                            <div className="flex items-center gap-2 pb-2 mb-2 border-b border-b-primary-200"><User className='text-secondary-800 size-5' /> <span>Last Name: Emmanuel</span></div> */}
                    <div className="flex items-center gap-2 pb-2 mb-2 border-b border-b-primary-200"><PhoneCall className='text-secondary-800 size-5' /> <span> 08277430854</span></div>
                    <div className="flex items-center gap-2 pb-2 mb-2 border-b border-b-primary-200"><Mail className='text-blue-500 size-5' /> <span> Hanna@gmmail.com</span></div>
                    <div className="flex items-center gap-2"><MapPin className='text-blue-500 size-5' /> <span> Oyo</span></div>
                </div>
            </div>
            <div className="w-full md:w-8/12">
                <div className="bg-primary-100 py-3 px-5 sand-500 shadow-sm">
                    <div className="text-lg font-semibold">More Details</div>

                    {/* tab  buttons */}
                    <div className="flex gap-3 mt-3">
                        <button onClick={() => setView("profile")} className={`py-1 ${view == "profile" ? "bg-secondary-800 text-primary-100" : "bg-primary-200 text-primary-600"}  border border-primary-300 font-semibold tracking-wider cursor-pointer px-2 rounded text-sm`}>Profile</button>
                        <button onClick={() => setView("account")} className={`py-1 ${view == "account" ? "bg-secondary-800 text-primary-100" : "bg-primary-200 text-primary-600"}  border border-primary-300 font-semibold tracking-wider cursor-pointer px-2 rounded text-sm`}>Account</button>
                    </div>

                    {/* profile details */}
                    {view == "profile" && (
                        <div className='mt-3'>
                            <div className='border-l-2 border-primary-500 px-3 py-2 transition-all duration-300 hover:border-secondary-800 bg-primary-200 cursor-pointer'>
                                <small className='font-semibold text-primary-600'>Profile Status</small>
                                <div className='mt-1'><button className='bg-blue-500 text-white px-3 py-1 text-sm rounded cursor-pointer'>Verify Profile</button></div>
                            </div>
                            <div className='border-l-2 border-primary-500 px-3 py-2 transition-all duration-300 hover:border-secondary-800 bg-primary-100 cursor-pointer'>
                                <small className='font-semibold text-primary-600'>Address</small>
                                <div>Pending...</div>
                            </div>
                            <div className='border-l-2 border-primary-500 px-3 py-2 transition-all duration-300 hover:border-secondary-800 bg-primary-200 cursor-pointer'>
                                <small className='font-semibold text-primary-600'>City</small>
                                <div>Pending...</div>
                            </div>
                            <div className='border-l-2 border-primary-500 px-3 py-2 transition-all duration-300 hover:border-secondary-800 bg-primary-100 cursor-pointer'>
                                <small className='font-semibold text-primary-600'>NIN</small>
                                <div>Pending...</div>
                            </div>
                        </div>
                    )}

                    {view == "account" && (
                        <div className='mt-3'>
                            <div className='border-l-2 border-primary-500 px-3 py-2 transition-all duration-300 hover:border-secondary-800 bg-primary-200 cursor-pointer'>
                                <small className='font-semibold text-primary-600'>Account Name</small>
                                <div className='mt-1'><button className='bg-blue-500 text-white px-3 py-1 text-sm rounded cursor-pointer'>Verify Account</button></div>
                            </div>
                            <div className='border-l-2 border-primary-500 px-3 py-2 transition-all duration-300 hover:border-secondary-800 bg-primary-100 cursor-pointer'>
                                <small className='font-semibold text-primary-600'>Bank Name</small>
                                <div>Pending...</div>
                            </div>
                            <div className='border-l-2 border-primary-500 px-3 py-2 transition-all duration-300 hover:border-secondary-800 bg-primary-200 cursor-pointer'>
                                <small className='font-semibold text-primary-600'>Bank Number</small>
                                <div>Pending...</div>
                            </div>
                            <div className='border-l-2 border-primary-500 px-3 py-2 transition-all duration-300 hover:border-secondary-800 bg-primary-100 cursor-pointer'>
                                <small className='font-semibold text-primary-600'>BVN</small>
                                <div>Pending...</div>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}
