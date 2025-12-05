import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const cleanOldFiles = () => {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  fs.readdir(UPLOAD_DIR, (err, files) => {
    if (err) {
      console.error("Failed to read upload directory for cleanup", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(UPLOAD_DIR, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        if (Date.now() - stats.mtimeMs > ONE_DAY_MS) {
          fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete old file: ${file}`, err);
            else console.log(`Deleted old file: ${file}`);
          });
        }
      });
    });
  });
};

export const getFilePath = (filename: string) => {
    // Prevent path traversal
    const safeFilename = path.basename(filename);
    return path.join(UPLOAD_DIR, safeFilename);
};
