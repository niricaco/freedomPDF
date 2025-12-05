'use client';

import { useState } from 'react';

export default function FileUploader({ onUploadSuccess }: { onUploadSuccess: (id: string) => void }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;

        setUploading(true);
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Upload failed');

            const data = await res.json();
            onUploadSuccess(data.fileId);
        } catch (error) {
            console.error(error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg">
            <input
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
                id="file-upload"
            />
            <label
                htmlFor="file-upload"
                className="px-4 py-2 text-white bg-blue-600 rounded cursor-pointer hover:bg-blue-700"
            >
                {uploading ? 'Uploading...' : 'Select PDF'}
            </label>
        </div>
    );
}
