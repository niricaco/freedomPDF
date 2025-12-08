import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUploader from '../FileUploader';

// Mock fetch
global.fetch = jest.fn();

describe('FileUploader', () => {
    const mockOnUploadSuccess = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the upload button', () => {
        render(<FileUploader onUploadSuccess={mockOnUploadSuccess} />);
        expect(screen.getByLabelText('Select PDF')).toBeInTheDocument();
    });

    it('handles file upload successfully', async () => {
        const mockFileId = '123-abc';
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ fileId: mockFileId }),
        });

        render(<FileUploader onUploadSuccess={mockOnUploadSuccess} />);

        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const input = screen.getByLabelText('Select PDF');

        fireEvent.change(input, { target: { files: [file] } });

        // Check if loading state is shown
        expect(screen.getByText('Uploading...')).toBeInTheDocument();

        await waitFor(() => {
            expect(mockOnUploadSuccess).toHaveBeenCalledWith(mockFileId);
        });

        // Check if loading state is removed
        expect(screen.getByText('Select PDF')).toBeInTheDocument();
    });

    it('handles upload failure', async () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
        });

        render(<FileUploader onUploadSuccess={mockOnUploadSuccess} />);

        const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' });
        const input = screen.getByLabelText('Select PDF');

        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(alertMock).toHaveBeenCalledWith('Upload failed');
        });

        expect(mockOnUploadSuccess).not.toHaveBeenCalled();
        alertMock.mockRestore();
    });
});
