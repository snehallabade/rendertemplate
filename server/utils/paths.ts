import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../../');

export const resolveServerPath = (...parts: string[]) => {
    return path.resolve(rootDir, 'server', ...parts);
};

export const resolveClientPath = (...parts: string[]) => {
    return path.resolve(rootDir, 'client', ...parts);
};

export const resolvePublicPath = (...parts: string[]) => {
    return path.resolve(rootDir, 'dist/public', ...parts);
};

export const resolveRootPath = (...parts: string[]) => {
    return path.resolve(rootDir, ...parts);
};
