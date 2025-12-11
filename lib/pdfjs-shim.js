// Shim to force pdfjs to use legacy build and provide CommonJS-compatible export
try {
  module.exports = require('pdfjs-dist/legacy/build/pdf.js');
} catch (e) {
  // Fallback: try non-legacy path
  module.exports = require('pdfjs-dist/build/pdf');
}
