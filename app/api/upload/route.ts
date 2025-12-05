import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { cleanOldFiles, getFilePath } from '@/lib/storage';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
        return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: "Only PDF files are allowed" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileId = uuidv4();
    const fileName = `${fileId}.pdf`;
    const filePath = getFilePath(fileName);

    try {
        await fs.promises.writeFile(filePath, buffer);

        // Trigger cleanup asynchronously
        cleanOldFiles();

        return NextResponse.json({ fileId });
    } catch (error) {
        console.error("Upload failed", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
