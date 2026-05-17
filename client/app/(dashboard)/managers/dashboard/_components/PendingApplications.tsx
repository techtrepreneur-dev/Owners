'use client';

import { Eye } from 'lucide-react';
import React, { useState } from 'react';

// Sample activities data - back to original
const applicationData = [
    {
        id: 1,
        name: 'Sike Abu',
        timestamp: '11:30 AM',
        date: 'Today',
    },
    {
        id: 2,
        name: 'Olaide Kabal',
        timestamp: '12:00 AM',
        date: 'Today',
    },
    {
        id: 3,
        name: 'Mike Richard',
        timestamp: '01:30 PM',
        date: 'Today',
    },
    {
        id: 4,
        name: 'Jack Christ',
        timestamp: '02:30 PM',
        date: 'Today',
    },
    {
        id: 5,
        name: 'Malik Bolu',
        timestamp: '03:00 PM',
        date: 'Today',
    },
    {
        id: 6,
        name: 'Efe Abal',
        timestamp: '5:30 PM',
        date: 'Yesterday',
    },
    {
        id: 7,
        name: 'Samuel David',
        timestamp: '07:30 PM',
        date: 'Yesterday',
    },
    {
        id: 8,
        name: 'Emeka Akube',
        timestamp: '08:30 PM',
        date: 'This week',
    },
];

type DateFilter = 'today' | 'yesterday' | 'this_week';

const PendingApplications = () => {
    const [dateFilter, setDateFilter] = useState<DateFilter>('today');

    // Filter activities based on date filter
    const filteredApplication = applicationData.filter(app => {
        if (dateFilter === 'today') return app.date === 'Today';
        if (dateFilter === 'yesterday') return app.date === 'Yesterday';
        return true; // 'this_week'  shows all
    }).slice(0, 6);

    return (
        <div className="bg-primary-50 rounded-lg shadow-sm border border-gray-100">
            <div className="p-5 border-b border-gray-100">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-800">Pending Applications</h2>
                    <p className="text-xs bg-blue-400 rounded px-1.5 py-0.5 text-primary-50 font-medium">5 new</p>
                </div>

                <div className="flex space-x-2 mt-4">
                    <button
                        type="button"
                        className={`px-4 py-1.5 text-xs font-medium rounded-md cursor-pointer ${dateFilter === 'today'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                        onClick={() => setDateFilter('today')}
                    >
                        Today
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-1.5 text-xs font-medium rounded-md cursor-pointer ${dateFilter === 'yesterday'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                        onClick={() => setDateFilter('yesterday')}
                    >
                        Yesterday
                    </button>
                    <button
                        type="button"
                        className={`px-4 py-1.5 text-xs font-medium rounded-md cursor-pointer  ${dateFilter === 'this_week'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-white text-gray-700 border border-gray-200'
                            }`}
                        onClick={() => setDateFilter('this_week')}
                    >
                        This week
                    </button>
                </div>
            </div>

            <div className="divide-y divide-gray-100">
                {filteredApplication.map((app, index) => (
                    <div key={app.id} className="p-4">
                        <div className="flex space-x-3">
                            <div className='text-[10px] bg-blue-400 text-primary-50 w-5 h-5 flex items-center justify-center rounded-full'>
                                {index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-sm font-medium text-gray-800">{app.name}</h3>
                                    <p className="text-xs text-gray-500 font-medium">{app.timestamp}</p>
                                </div>
                                {/* action buttons */}
                                <div className='flex justify-between items-center mt-2'>
                                    <div className='flex gap-2'>
                                        <button
                                            type="button"
                                            className='px-2.5 py-1 text-xs font-medium rounded-md 
                                            bg-secondary-800 text-primary-50 border border-gray-200 cursor-pointer '
                                        >
                                            Accept
                                        </button>

                                        <button
                                            type="button"
                                            className='px-2.5 py-1 text-xs font-medium rounded-md 
                                            text-red-500 border border-red-500 cursor-pointer'
                                        >
                                            Decline
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            className='px-1.5 py-1 font-bold rounded-md cursor-pointer
                                             bg-blue-400'>
                                            <Eye className='text-white size-5' />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='text-center my-3'>
                <a href="" className='font-medium text-sm text-blue-500 border border-blue-500 hover:text-primary-50 hover:bg-blue-500 transition-all  px-2 py-1.5 rounded-md'>See All</a>
            </div>
        </div>
    );
};

export default PendingApplications;