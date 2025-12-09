import { cleanOldFiles, getFilePath } from '../storage';
import fs from 'fs';
import path from 'path';

jest.mock('fs');

describe('Storage', () => {
    describe('getFilePath', () => {
        it('should return the correct path for a filename', () => {
            const filename = 'test.pdf';
            const expectedPath = path.join(process.cwd(), 'uploads', filename);
            expect(getFilePath(filename)).toBe(expectedPath);
        });

        it('should prevent path traversal', () => {
            const filename = '../../test.pdf';
            const expectedPath = path.join(process.cwd(), 'uploads', 'test.pdf');
            expect(getFilePath(filename)).toBe(expectedPath);
        });
    });

    describe('cleanOldFiles', () => {
        const ONE_DAY_MS = 24 * 60 * 60 * 1000;

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should delete files older than 24 hours', () => {
            const now = Date.now();
            const oldFile = 'old.pdf';
            const newFile = 'new.pdf';

            // Mock readdir
            (fs.readdir as unknown as jest.Mock).mockImplementation((dir, callback) => {
                callback(null, [oldFile, newFile]);
            });

            // Mock stat
            (fs.stat as unknown as jest.Mock).mockImplementation((filePath, callback) => {
                if (filePath.includes(oldFile)) {
                    callback(null, { mtimeMs: now - ONE_DAY_MS - 1000 });
                } else if (filePath.includes(newFile)) {
                    callback(null, { mtimeMs: now });
                }
            });

            // Mock unlink
            (fs.unlink as unknown as jest.Mock).mockImplementation((filePath, callback) => {
                callback(null);
            });

            cleanOldFiles();

            expect(fs.readdir).toHaveBeenCalled();
            expect(fs.stat).toHaveBeenCalledTimes(2);
            expect(fs.unlink).toHaveBeenCalledTimes(1);
            expect(fs.unlink).toHaveBeenCalledWith(expect.stringContaining(oldFile), expect.any(Function));
        });

         it('should handle readdir errors', () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
             (fs.readdir as unknown as jest.Mock).mockImplementation((dir, callback) => {
                callback(new Error('Failed to read'), null);
            });

            cleanOldFiles();

            expect(consoleSpy).toHaveBeenCalledWith("Failed to read upload directory for cleanup", expect.any(Error));
            consoleSpy.mockRestore();
        });
    });
});
