import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// In production, check for Render's directory structure first
const projectRoot = process.env.NODE_ENV === 'production'
    ? process.env.RENDER === 'true'
        ? '/opt/render/project'
        : path.resolve(__dirname, '../../../')
    : path.resolve(__dirname, '../../');

// Log the resolved paths in production for debugging
if (process.env.NODE_ENV === 'production') {
    console.log('Project root:', projectRoot);
    console.log('Current directory:', __dirname);
}

export {
    __filename,
    __dirname,
    projectRoot
};
