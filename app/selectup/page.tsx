import { ArrowUpTrayIcon, SignalIcon } from '@heroicons/react/24/outline'
import Link from 'next/link';


export default function SelectUp() {

    return (

        <>
            <div className="flex justify-center">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <Link href="/upload" className="rounded-2xl border border-gray-300 p-24 hover:border-red-600">
                        <ArrowUpTrayIcon className="w-52 text-gray-500 hover:text-red-600" />
                    
                        <p className="text-4xl font-bold text-center text-gray-500 hover:text-red-600">อัปโหลดวิดีโอ</p>
                    
                    </Link>

                    <Link href="/live-create" className="rounded-2xl border border-gray-300 p-24 hover:border-red-600">
                        <SignalIcon className="w-52 text-gray-500 hover:text-red-600" />
                    
                        <p className="text-4xl font-bold text-center text-gray-500 hover:text-red-600">สตรีมสด</p>
                    
                    </Link>

                </div>
            </div>
        
        </>
    );

}