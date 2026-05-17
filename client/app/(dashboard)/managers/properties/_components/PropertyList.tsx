"use client"
import Card from '@/components/Card'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { FiSearch, FiSliders } from 'react-icons/fi'

export default function PropertyList({ properties }) {

    const [searchTerm, setSearchTerm] = useState<string>("");
    const [clearSearch, setClearSearch] = useState<boolean>(false);
    const [propertyData, setPropertyData] = useState(properties);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState(['', '']);

    function handleFilter(type: string, value: string) {
        let result
        if (type == "status") {
            result = properties.filter((property) => property.status == value)
            setFilterOptions([type, value])
        } else if (type == "beds") {
            result = properties.filter((property) => property.beds == value)
            setFilterOptions([type, value])
        } else if (type == "baths") {
            result = properties.filter((property) => property.baths == value)
            setFilterOptions([type, value])
        } else {
            setFilterOptions(["", ""])
            result = properties
        }

        setPropertyData(result)
    }

    useEffect(() => {
        handleSearch()
    }, [searchTerm])
    // Handle search 
    function handleSearch() {
        if (searchTerm !== "") {
            setClearSearch(true)
        }
        const result = propertyData.filter((property) => property.name.toLowerCase().includes(searchTerm.toLowerCase()))
        setPropertyData(result)
    }

    // clear search 
    function handleClearSearch() {
        setPropertyData(properties)
        setSearchTerm("")
        setClearSearch(false)
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center  my-3">
                    {/* Search Bar */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiSearch className="text-gray-400 h-4 w-4" />
                        </div>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-50 pl-9 pr-4 py-2 rounded-md text-sm border border-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                            placeholder="Search activities..."
                        />
                        {clearSearch && (
                            <div onClick={() => handleClearSearch()} className="absolute inset-y-0 right-0 cursor-pointer z-2 pr-3 flex items-center">
                                <X className="text-gray-500 h-4 w-4 " />
                            </div>
                        )}

                    </div>

                    {/* filter */}
                    <div className='relative'>
                        <div onClick={() => setFilterModalOpen(!filterModalOpen)} className='cursor-pointer'>
                            <FiSliders className="text-gray-500 h-4 w-4" />
                        </div>
                        {/* filter modal box */}
                        {filterModalOpen && (
                            <div className="absolute top-12 right-0 z-10 w-60">
                                <div
                                    className="bg-white rounded-lg shadow-lg p-3 border border-gray-100"
                                    style={{ boxShadow: '0 4px 15px rgba(0,0,0,0.06)' }}>

                                    <h2 className="text-sm font-semibold mb-2 border-b border-b-gray-300 pb-2">Filter Properties</h2>

                                    {/* buttons */}
                                    <div className="space-y-1">
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => handleFilter("status", "active")}
                                                className="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 flex items-center
                                                bg-primary-50 text-secondary-800 border-l-2 border-secondary-800">
                                                <span>Active</span>
                                            </button>
                                            <button
                                                className="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 flex items-center
                                                bg-green-50 text-green-700">
                                                <span>Inactive</span>
                                            </button>
                                        </div>
                                        <div className='flex gap-2 mt-1.5'>
                                            <button
                                                className="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 flex items-center
                                                bg-green-50 text-green-700">
                                                <span>Published</span>
                                            </button>
                                            <button
                                                className="w-full text-left px-3 py-2 text-sm rounded-md transition-colors duration-150 flex items-center
                                                bg-green-50 text-green-700">
                                                <span>Declined</span>
                                            </button>
                                        </div>

                                    </div>

                                    {/* radio buttons beds */}
                                    <div className='mt-3 '>
                                        <div className='flex gap-5 items-center bg-primary-50 rounded-md py-2 px-3'>
                                            <span className='font-semibold text-primary-600'>Beds</span>
                                            <div className='flex gap-3'>
                                                {[1, 2, 3, 4, 5].map((val) => (
                                                    <div key={val} className='flex flex-col items-center'>
                                                        <span className={`text-xs font-semibold ${(filterOptions[0] == "beds" && filterOptions[1] == val) && "text-secondary-700"}`}>{val}</span>
                                                        <div><input onChange={e => handleFilter("beds", e.target.value)} type="radio" name='fil' value={val} checked={filterOptions[0] == "beds" && filterOptions[1] == val} /></div>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>

                                    {/* radio buttons baths */}
                                    <div className='mt-3 '>
                                        <div className='flex gap-5 items-center bg-primary-50 rounded-md py-2 px-3'>
                                            <span className='font-semibold text-primary-600'>Baths</span>
                                            <div className='flex gap-3'>
                                                {["1", "2", "3", "4", "5"].map((val) => (
                                                    <div key={val} className='flex flex-col items-center'>
                                                        <span className={`text-xs font-semibold ${(filterOptions[0] == "baths" && filterOptions[1] == val) && "text-secondary-700"}`}>{val}</span>
                                                        <div><input onChange={e => handleFilter("baths", e.target.value)} type="radio" name='fil' value={val} checked={filterOptions[0] == "baths" && filterOptions[1] == val} /></div>
                                                    </div>
                                                ))}

                                            </div>
                                        </div>
                                    </div>

                                    {/*  */}
                                    <div className='flex gap-3 mt-4 justify-end'>
                                        <button
                                            onClick={() => handleFilter("", "")}
                                            className="px-2 py-1 cursor-pointer text-sm rounded-md transition-colors duration-150 flex items-center
                                                border-primary-400 text-primary-500 border-2">
                                            Clear
                                        </button>
                                        <button
                                            onClick={() => setFilterModalOpen(false)}
                                            className="px-2 py-1 text-sm cursor-pointer rounded-md transition-colors duration-150 flex items-center
                                                border-red-400 text-red-400 border-2">
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* add property button */}
                <div>
                    <Button
                        variant="secondary"
                        className="md:ml-4 shadow bg-secondary-800 text-primary-100 hover:bg-primary-100 hover:text-primary-700">
                        <>
                            <Plus className="h-4 w-4" />
                            <span className="hidden md:block">New Property</span>
                        </>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-6">

                {propertyData?.map((property) => (
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
                <p>You don&lsquo;t have any properties</p>
            )}
        </div>
    )
}
