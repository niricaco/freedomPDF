export function convertDomToPdfCoordinates(
    domX: number,
    domY: number,
    domWidth: number | undefined,
    domHeight: number | undefined,
    scale: number,
    pageHeight: number // PDF page height in points
) {
    // 1. Unscale the DOM coordinates
    const pdfX = domX / scale;
    const unscaledDomY = domY / scale;

    // 2. Flip Y axis
    // PDF (0,0) is bottom-left. DOM (0,0) is top-left.
    // So pdfY = pageHeight - unscaledDomY
    // But if we are drawing a rectangle or text with height, we need to consider the anchor point.
    // pdf-lib draws text from bottom-left corner.
    // pdf-lib draws rectangles from bottom-left corner.
    // DOM elements are usually positioned by their top-left corner.

    // So if I have a DOM element at unscaledDomY with height H:
    // Its bottom edge in DOM is unscaledDomY + H.
    // In PDF, that bottom edge corresponds to (pageHeight - (unscaledDomY + H)).
    // So the PDF Y coordinate (bottom-left of the rect) is pageHeight - unscaledDomY - unscaledHeight.

    let pdfY = pageHeight - unscaledDomY;

    let pdfWidth: number | undefined;
    let pdfHeight: number | undefined;

    if (domWidth !== undefined && domHeight !== undefined) {
         pdfWidth = domWidth / scale;
         pdfHeight = domHeight / scale;
         pdfY = pageHeight - unscaledDomY - pdfHeight;
    } else {
        // For text, pdf-lib usually takes the baseline.
        // If we want the top-left of the text to be at domY,
        // we need to subtract the font height or approximate it.
        // For now let's assume the user clicks where the baseline should be or we adjust.
        // A simple approximation is shifting down by font size.
        // But usually "Text" tool places top-left.
        // Let's assume we pass the font size later.
        // For now just basic conversion.
    }

    return { x: pdfX, y: pdfY, width: pdfWidth, height: pdfHeight };
}
