import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import { getFilePath } from '@/lib/storage';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Fix type signature for App Router route handler with params
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);
    if (!session) {
        // Allowing unauthenticated download for now for the generated link to work easily?
        // Or enforce it. Let's enforce it to be consistent with "Security".
        // However, if the user downloads via a link, the browser session cookie should handle it.
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const fileId = id;
    const filePath = getFilePath(`${fileId}.pdf`);

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(filePath);

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${fileId}.pdf"`,
        },
    });
}
