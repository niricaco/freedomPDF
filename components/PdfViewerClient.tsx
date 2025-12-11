"use client";

import React, { useEffect, useState } from 'react';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

export interface PdfViewerClientProps {
  file: string | Uint8Array | object;
  scale: number;
  onDocumentLoadSuccess?: (arg: any) => void;
  onPageLoadSuccess?: (pageIndex: number, page: any) => void;
  handlePageClick?: (e: React.MouseEvent, pageIndex: number) => void;
  operations?: any[];
  onError?: (err: string) => void;
}

export default function PdfViewerClient({ file, scale, onDocumentLoadSuccess, onPageLoadSuccess, handlePageClick, onError }: PdfViewerClientProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [DocumentComp, setDocumentComp] = useState<any>(null);
  const [PageComp, setPageComp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // First try loading the legacy pdfjs build which is friendlier to webpack/Next setups.
        // This can avoid runtime evaluation issues inside the ESM build of pdfjs-dist.
        try {
          const pdfjsLegacy: any = await import('pdfjs-dist/legacy/build/pdf');
          if (pdfjsLegacy && pdfjsLegacy.GlobalWorkerOptions) {
            const v = pdfjsLegacy.version || '2.16.105';
            pdfjsLegacy.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${v}/build/pdf.worker.js`;
          }
        } catch (e) {
          // ignore — we'll still try to load react-pdf below
          // console.debug('pdfjs legacy import failed', e);
        }

        // Now import react-pdf and ensure its pdfjs worker is set
        const mod = await import('react-pdf');
        try {
          const { pdfjs } = mod as any;
          if (pdfjs && pdfjs.GlobalWorkerOptions) {
            const v = pdfjs.version || '2.16.105';
            // use non-mjs worker URL which often avoids bundler ESM issues
            pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${v}/build/pdf.worker.js`;
          }
        } catch (e) {
          // ignore worker setup issues
        }

        if (!mounted) return;
        setDocumentComp(() => (mod as any).Document);
        setPageComp(() => (mod as any).Page);
        setError(null);
      } catch (err) {
        console.error('Failed to load react-pdf dynamically', err);
        const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
        setError(msg);
        if (onError) onError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  function _onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    if (onDocumentLoadSuccess) onDocumentLoadSuccess({ numPages });
  }

  if (loading) return <div>Loading PDF viewer...</div>;
  if (error) return <div className="text-center">PDF viewer error: {error}</div>;
  if (!DocumentComp || !PageComp) return <div className="text-center">PDF viewer unavailable</div>;

  const Document = DocumentComp;
  const Page = PageComp;

  return (
    <Document
      file={file}
      onLoadSuccess={_onDocumentLoadSuccess}
      className="flex flex-col gap-4"
    >
      {Array.from(new Array(numPages), (el, index) => (
        <div key={`page_${index + 1}`} className="relative border shadow-lg bg-white">
          <Page
            pageNumber={index + 1}
            scale={scale}
            onLoadSuccess={(page) => onPageLoadSuccess && onPageLoadSuccess(index, page)}
            onClick={(e) => handlePageClick && handlePageClick(e, index)}
          />
        </div>
      ))}
    </Document>
  );
}
