# FreedomPDF Development Guide

## Prerequisites
- Node.js 18+
- Docker & Docker Compose

## Setup
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run development server:
    ```bash
    npm run dev
    ```

## Docker
To run with Docker:
```bash
docker-compose up --build
```

## Architecture Notes
-   **PDF Coordinates:** PDF uses a Bottom-Left origin. HTML uses Top-Left. When sending coordinates from the client, they must be converted on the server or client.
    -   Formula: `pdfY = pageHeight - domY` (scaled appropriately).
-   **Fonts:** `pdf-lib` requires embedding fonts before use. We use `StandardFonts.Helvetica`.
-   **Security:** All uploads are renamed to UUIDs.

## Directory Structure
-   `app/`: Next.js App Router.
-   `app/api/`: Backend API routes.
-   `uploads/`: Persistent storage for PDF files.
