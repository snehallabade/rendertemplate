import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// In production, the server code is in dist/server/utils
const projectRoot = process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../../../')
    : path.resolve(__dirname, '../../');

export {
    __filename,
    __dirname,
    projectRoot
};
