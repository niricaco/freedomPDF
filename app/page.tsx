'use client';

import { useState } from 'react';
import FileUploader from '@/components/FileUploader';
import dynamic from 'next/dynamic';

const PdfEditor = dynamic(() => import('@/components/PdfEditor'), {
    ssr: false,
});

export default function Home() {
    const [fileId, setFileId] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-gray-50 text-gray-900">
            {!fileId ? (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <h1 className="text-4xl font-bold mb-8 text-blue-800">FreedomPDF</h1>
                    <p className="mb-8 text-lg text-gray-600">Secure, internal PDF manipulation tool.</p>
                    <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
                        <FileUploader onUploadSuccess={setFileId} />
                    </div>
                </div>
            ) : (
                <PdfEditor fileId={fileId} />
            )}
        </main>
    );
}
