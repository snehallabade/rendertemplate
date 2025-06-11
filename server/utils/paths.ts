import path from 'path';
import { projectRoot } from './initialize.js';

export const resolveServerPath = (...parts: string[]) => {
    return path.resolve(projectRoot, 'server', ...parts);
};

export const resolveClientPath = (...parts: string[]) => {
    return path.resolve(projectRoot, 'client', ...parts);
};

export const resolvePublicPath = (...parts: string[]) => {
    return path.resolve(projectRoot, 'dist/public', ...parts);
};

export const resolveRootPath = (...parts: string[]) => {
    return path.resolve(projectRoot, ...parts);
};
