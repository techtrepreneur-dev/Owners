import { XCircle } from 'lucide-react';
import React from 'react'

export default function page() {
    return (
        <div className="max-w-sm w-full mx-auto mt-30 sand-400 text-center p-6 border border-primary-200 rounded-xl shadow-lg">
            <XCircle className="mx-auto text-red-400 mb-2 " size={40} />
            <h1 className="text-xl text-emerald-600 sand-500">Application Unsuccessful!</h1>
            <p className="text-gray-600 mt-2">Please try again</p>
        </div>
    );
}
