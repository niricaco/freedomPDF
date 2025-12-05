# FreedomPDF Development Plan

## 1. Tech Stack & Configuration
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Containerization:** Docker (Multi-stage build)
- **Orchestration:** Docker Compose
- **Authentication:** NextAuth.js (CredentialsProvider)
- **PDF Handling:** `react-pdf` (Client), `pdf-lib` (Server)

## 2. Architecture
- **Storage:** Local filesystem (`./uploads`) mounted via Docker volume.
- **Client:** `react-pdf` for rendering. Overlay `div` for editing.
- **Server:** API routes for upload (`POST /api/upload`) and processing (`POST /api/process`).
- **Coordinate System:** Logic to convert DOM (Top-Left 0,0) to PDF (Bottom-Left 0,0) coordinates.

## 3. Implementation Steps

### Phase A: Backend & Security
1.  **Storage:** Implement `POST /api/upload`.
    -   Sanitize filenames using `uuid`.
    -   Prevent path traversal.
    -   Implement cleanup for files older than 24h.
2.  **Processing:** Implement `POST /api/process`.
    -   Load PDF with `pdf-lib`.
    -   Embed standard font (`Helvetica`).
    -   Apply edits (Text, Whiteout).
    -   Save as new file.

### Phase B: Frontend
1.  **Viewer:** Implement `react-pdf` viewer.
    -   Handle worker configuration.
    -   Use `AutoSizer` (or responsive container).
2.  **Editor:** Implement Overlay.
    -   Tools: Text, Whiteout.
    -   Coordinate conversion.
3.  **UI:** Tailwind CSS styling.

## 4. Verification
-   Verify Docker build.
-   Verify Upload -> Edit -> Process flow.
