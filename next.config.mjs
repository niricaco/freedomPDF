/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        // prevent optional native canvas resolution
        config.resolve.alias.canvas = false;

        // Force pdfjs to use the legacy (non-ESM) build so it doesn't execute
        // ESM module initialization that can break under Next's dev webpack runtime.
        try {
            // Point imports to our local shim which re-exports the legacy build.
            config.resolve.alias['pdfjs-dist/build/pdf'] = require.resolve('./lib/pdfjs-shim.js');
            config.resolve.alias['pdfjs-dist/build/pdf.mjs'] = require.resolve('./lib/pdfjs-shim.js');
            config.resolve.alias['pdfjs-dist/legacy/build/pdf'] = require.resolve('./lib/pdfjs-shim.js');
        } catch (e) {
            // ignore if module not present during install steps
        }

        return config;
    },
};

export default nextConfig;
