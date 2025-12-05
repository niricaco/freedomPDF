import { NextRequest, NextResponse } from 'next/server';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import { getFilePath } from '@/lib/storage';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface EditOperation {
    type: 'text' | 'whiteout';
    pageIndex: number;
    x: number;
    y: number; // PDF coordinates (Bottom-Left origin)
    width?: number;
    height?: number;
    text?: string;
    fontSize?: number;
}

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { fileId, operations } = body as { fileId: string; operations: EditOperation[] };

    if (!fileId || !operations) {
        return NextResponse.json({ error: "Missing fileId or operations" }, { status: 400 });
    }

    const filePath = getFilePath(`${fileId}.pdf`);

    if (!fs.existsSync(filePath)) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    try {
        const pdfBytes = await fs.promises.readFile(filePath);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const pages = pdfDoc.getPages();

        for (const op of operations) {
            const page = pages[op.pageIndex];
            if (!page) continue;

            if (op.type === 'text' && op.text) {
                page.drawText(op.text, {
                    x: op.x,
                    y: op.y,
                    size: op.fontSize || 12,
                    font: helveticaFont,
                    color: rgb(0, 0, 0),
                });
            } else if (op.type === 'whiteout' && op.width && op.height) {
                page.drawRectangle({
                    x: op.x,
                    y: op.y,
                    width: op.width,
                    height: op.height,
                    color: rgb(1, 1, 1), // White
                });
            }
        }

        const modifiedPdfBytes = await pdfDoc.save();

        const newFileId = `${fileId}_processed_${Date.now()}`;
        const newFileName = `${newFileId}.pdf`;
        const newFilePath = getFilePath(newFileName);

        await fs.promises.writeFile(newFilePath, modifiedPdfBytes);

        return NextResponse.json({ fileId: newFileId });

    } catch (error) {
        console.error("Processing failed", error);
        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
}
