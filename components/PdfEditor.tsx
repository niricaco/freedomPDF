'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { convertDomToPdfCoordinates } from '@/lib/coordinates';

// Configure worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfEditorProps {
    fileId: string;
}

interface EditOperation {
    type: 'text' | 'whiteout';
    pageIndex: number;
    x: number;
    y: number; // DOM coords relative to page
    width?: number;
    height?: number;
    text?: string;
    pdfPageHeight?: number; // Needed for server conversion
}

export default function PdfEditor({ fileId }: PdfEditorProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState(1.0);
    const [tool, setTool] = useState<'none' | 'text' | 'whiteout'>('none');
    const [operations, setOperations] = useState<EditOperation[]>([]);
    const [processedFileId, setProcessedFileId] = useState<string | null>(null);
    const [pageDimensions, setPageDimensions] = useState<{ [key: number]: { width: number; height: number } }>({});

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    function onPageLoadSuccess(pageIndex: number, page: any) {
        // page.view is [x, y, w, h]
        setPageDimensions(prev => ({
             ...prev,
             [pageIndex]: { width: page.view[2], height: page.view[3] }
        }));
    }

    const handlePageClick = (e: React.MouseEvent, pageIndex: number) => {
        if (tool === 'none') return;

        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (tool === 'text') {
            const text = prompt("Enter text:");
            if (text) {
                setOperations([
                    ...operations,
                    { type: 'text', pageIndex, x, y, text }
                ]);
            }
        } else if (tool === 'whiteout') {
             const w = 100 * scale;
             const h = 20 * scale;
             setOperations([
                ...operations,
                { type: 'whiteout', pageIndex, x, y, width: w, height: h }
             ]);
        }
    };

    const handleSave = async () => {
        const serverOps = operations.map(op => {
            const dims = pageDimensions[op.pageIndex];
            if (!dims) return null;

            // Use the shared utility for conversion
            const { x, y, width, height } = convertDomToPdfCoordinates(
                op.x,
                op.y,
                op.width,
                op.height,
                scale,
                dims.height
            );

            // Adjust text Y specifically if needed (optional refinement)
             let finalY = y;
             if (op.type === 'text') {
                 // pdf-lib draws at baseline.
                 finalY = y - 12;
            }

            return {
                type: op.type,
                pageIndex: op.pageIndex,
                x: x,
                y: finalY,
                width: width,
                height: height,
                text: op.text,
                fontSize: 12
            };
        }).filter(Boolean);

        const res = await fetch('/api/process', {
            method: 'POST',
            body: JSON.stringify({ fileId, operations: serverOps }),
        });

        if (res.ok) {
            const data = await res.json();
            setProcessedFileId(data.fileId);
        } else {
            alert('Processing failed. You may need to log in.');
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <div className="p-4 bg-gray-100 flex gap-4 items-center shadow-md z-10 sticky top-0">
                <button
                    onClick={() => setTool('none')}
                    className={`px-4 py-2 rounded ${tool === 'none' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                >
                    View
                </button>
                <button
                    onClick={() => setTool('text')}
                    className={`px-4 py-2 rounded ${tool === 'text' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                >
                    Text Tool
                </button>
                <button
                    onClick={() => setTool('whiteout')}
                    className={`px-4 py-2 rounded ${tool === 'whiteout' ? 'bg-blue-600 text-white' : 'bg-white'}`}
                >
                    Whiteout Tool
                </button>
                <div className="flex-grow" />
                <button onClick={() => setScale(s => s + 0.1)} className="px-2 bg-white rounded">+</button>
                <span className="mx-2">{(scale * 100).toFixed(0)}%</span>
                <button onClick={() => setScale(s => Math.max(0.1, s - 0.1))} className="px-2 bg-white rounded">-</button>
                <button onClick={handleSave} className="ml-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    Save & Process
                </button>
                {processedFileId && (
                    <a
                        href={`/api/file/${processedFileId}`}
                        download
                        className="ml-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        Download Result
                    </a>
                )}
            </div>

            <div className="flex-grow overflow-auto bg-gray-500 p-8 flex justify-center">
                <Document
                    file={`/api/file/${fileId}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="flex flex-col gap-4"
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <div key={`page_${index + 1}`} className="relative border shadow-lg bg-white">
                             <Page
                                pageNumber={index + 1}
                                scale={scale}
                                onLoadSuccess={(page) => onPageLoadSuccess(index, page)}
                                onClick={(e) => handlePageClick(e, index)}
                            />
                            {operations.filter(op => op.pageIndex === index).map((op, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: 'absolute',
                                        left: op.x,
                                        top: op.y,
                                        width: op.width,
                                        height: op.height,
                                        border: op.type === 'whiteout' ? '1px solid red' : 'none',
                                        backgroundColor: op.type === 'whiteout' ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                                        pointerEvents: 'none',
                                        color: 'black',
                                        fontSize: '12px',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {op.type === 'text' && op.text}
                                </div>
                            ))}
                        </div>
                    ))}
                </Document>
            </div>
        </div>
    );
}
