import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const resolveServerPath = (...parts: string[]) => {
    return path.resolve(__dirname, ...parts);
};

export const resolveClientPath = (...parts: string[]) => {
    return path.resolve(__dirname, '../client', ...parts);
};

export const resolvePublicPath = (...parts: string[]) => {
    return path.resolve(__dirname, '../dist/public', ...parts);
};
