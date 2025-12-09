import { convertDomToPdfCoordinates } from '../coordinates';

describe('convertDomToPdfCoordinates', () => {
    // Basic conversion without width/height
    it('should correctly convert Y coordinate (flip axis) for a point', () => {
        const pageHeight = 800;
        const scale = 1;
        const domX = 100;
        const domY = 100;

        const result = convertDomToPdfCoordinates(domX, domY, undefined, undefined, scale, pageHeight);

        expect(result.x).toBe(100);
        // pdfY = pageHeight - domY = 800 - 100 = 700
        expect(result.y).toBe(700);
        expect(result.width).toBeUndefined();
        expect(result.height).toBeUndefined();
    });

    it('should handle scaling correctly', () => {
        const pageHeight = 800;
        const scale = 2; // DOM is 2x bigger than PDF points
        const domX = 200;
        const domY = 200;

        const result = convertDomToPdfCoordinates(domX, domY, undefined, undefined, scale, pageHeight);

        // pdfX = domX / scale = 200 / 2 = 100
        expect(result.x).toBe(100);
        // unscaledDomY = 200 / 2 = 100
        // pdfY = 800 - 100 = 700
        expect(result.y).toBe(700);
    });

    // Conversion with width/height (e.g. rectangles)
    it('should calculate coordinates for rectangles correctly', () => {
        const pageHeight = 800;
        const scale = 1;
        const domX = 100;
        const domY = 100;
        const domWidth = 50;
        const domHeight = 50;

        const result = convertDomToPdfCoordinates(domX, domY, domWidth, domHeight, scale, pageHeight);

        expect(result.x).toBe(100);
        expect(result.width).toBe(50);
        expect(result.height).toBe(50);
        // pdfY = pageHeight - unscaledDomY - pdfHeight
        // pdfY = 800 - 100 - 50 = 650
        expect(result.y).toBe(650);
    });

    it('should handle scaling with dimensions', () => {
        const pageHeight = 800;
        const scale = 2;
        const domX = 200;
        const domY = 200;
        const domWidth = 100;
        const domHeight = 100;

        const result = convertDomToPdfCoordinates(domX, domY, domWidth, domHeight, scale, pageHeight);

        // pdfX = 200 / 2 = 100
        expect(result.x).toBe(100);
        // pdfWidth = 100 / 2 = 50
        expect(result.width).toBe(50);
        // pdfHeight = 100 / 2 = 50
        expect(result.height).toBe(50);
        // unscaledDomY = 200 / 2 = 100
        // pdfY = 800 - 100 - 50 = 650
        expect(result.y).toBe(650);
    });
});
