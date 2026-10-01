
import { cookies } from 'next/headers';
import { ArrowLeft, CheckCircle, Grid2X2Icon } from "lucide-react";
import Link from 'next/link';
import { json } from 'zod';

export default async function SuccessPage({ searchParams }: PageProps) {

  const cookieStore = await cookies();
  const prevUrl = cookieStore.get('prev-url');

  return (
    <><div className="max-w-sm w-full mx-auto mt-30 sand-400 text-center p-6 border border-primary-200 rounded-xl shadow-lg">
      <CheckCircle className="mx-auto text-emerald-600 mb-2" size={40} />
      <h1 className="text-xl text-emerald-600 sand-500">Application Sent!</h1>
      <p className="text-gray-600 mt-2">Check the status of your application on your dashboard.</p>
    </div>
      <div className='flex gap-3 justify-center mt-5'>
        <Link href={prevUrl?.value || ""} className='flex gap-1 items-center border border-primary-200 px-3 py-1 rounded text-primary-600'> <ArrowLeft size={16} /> Back</Link>
        <Link href={`${process.env.NEXT_PUBLIC_APP__URL}/tenants/applications`} className='flex gap-1 items-center border border-primary-200 px-3 py-1 rounded text-primary-600'>Dashboard <Grid2X2Icon size={16} /></Link>
      </div>
    </>

  );

}