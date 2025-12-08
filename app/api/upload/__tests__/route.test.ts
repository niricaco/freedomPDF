import { POST } from '../route';
import fs from 'fs';
import { getServerSession } from "next-auth";

// 1. Mock dependencies
jest.mock("next-auth", () => ({
    getServerSession: jest.fn(),
}));

jest.mock('@/lib/storage', () => ({
    getFilePath: jest.fn((name) => `/mock/path/${name}`),
    cleanOldFiles: jest.fn(),
}));

jest.mock('fs', () => ({
    promises: {
        writeFile: jest.fn(),
    },
}));

// 2. Mock NextResponse completely to avoid environment issues
jest.mock('next/server', () => {
    return {
        NextResponse: {
            json: jest.fn((body, init) => ({
                body,
                status: init?.status || 200,
            })),
        },
    };
});

// 3. Helper to create a mock Request
const createMockRequest = (formDataMock: any) => {
    return {
        formData: jest.fn().mockResolvedValue(formDataMock),
    } as any;
};

describe('Upload API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 401 if unauthorized', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const req = createMockRequest({});
        const res = await POST(req);

        expect(res.status).toBe(401);
        expect(res.body).toEqual({ error: "Unauthorized" });
    });

    it('should upload a PDF file successfully', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({ user: { name: "Test User" } });

        // Mock File object
        const mockFile = {
            type: 'application/pdf',
            arrayBuffer: jest.fn().mockResolvedValue(Buffer.from('fake-pdf-content')),
        };

        const formDataMock = {
            get: jest.fn().mockReturnValue(mockFile),
        };

        const req = createMockRequest(formDataMock);
        const res = await POST(req);

        expect(res.status).toBe(200);
        expect(res.body.fileId).toBeDefined();

        // Verify fs write
        expect(fs.promises.writeFile).toHaveBeenCalledWith(
            expect.stringContaining('.pdf'),
            expect.anything()
        );
    });

    it('should return 400 if no file provided', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({ user: { name: "Test User" } });

        const formDataMock = {
            get: jest.fn().mockReturnValue(null),
        };

        const req = createMockRequest(formDataMock);
        const res = await POST(req);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "No file provided" });
    });

    it('should return 400 if file is not PDF', async () => {
        (getServerSession as jest.Mock).mockResolvedValue({ user: { name: "Test User" } });

        const mockFile = {
            type: 'text/plain', // Wrong type
            arrayBuffer: jest.fn(),
        };

        const formDataMock = {
            get: jest.fn().mockReturnValue(mockFile),
        };

        const req = createMockRequest(formDataMock);
        const res = await POST(req);

        expect(res.status).toBe(400);
        expect(res.body).toEqual({ error: "Only PDF files are allowed" });
    });
});
