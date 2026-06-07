import { API_URL } from '../api';

export function getImageUrl(path) {
    if (!path) return '';

    // Absolute URLs are ready to use.
    if (path.startsWith('http')) {
        return path;
    }

    // API-relative paths are served by the gateway.
    if (path.startsWith('/api')) {
        return `${API_URL.replace('/api', '')}${path}`;
    }

    // Product service serves uploaded assets.
    return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}
