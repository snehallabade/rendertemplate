import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectRoot } from './initialize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const resolveServerPath = (...parts: string[]) => {
    return path.resolve(projectRoot, 'server', ...parts);
};

export const resolveClientPath = (...parts: string[]) => {
    return path.resolve(projectRoot, 'client', ...parts);
};

export const resolvePublicPath = (...parts: string[]) => {
    // In production on Render, use the absolute path from project root
    if (process.env.NODE_ENV === 'production' && process.env.RENDER === 'true') {
        return path.resolve('/opt/render/project/dist/public', ...parts);
    }

    const paths = [
        path.resolve(projectRoot, 'dist/public', ...parts),
        path.resolve(projectRoot, 'public', ...parts),
        path.resolve(path.dirname(__dirname), '../dist/public', ...parts)
    ];

    // In production, log all possible paths for debugging
    if (process.env.NODE_ENV === 'production') {
        console.log('Checking public paths:');
        paths.forEach(p => {
            console.log(`- ${p} (exists: ${require('fs').existsSync(p)})`);
        });
    }

    // Return the first path that exists, or the default
    return paths.find(p => require('fs').existsSync(p)) || paths[0];
};

export const resolveRootPath = (...parts: string[]) => {
    return path.resolve(projectRoot, ...parts);
};
