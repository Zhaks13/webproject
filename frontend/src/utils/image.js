import API_URL from '../api';

export function getImageUrl(path) {
    if (!path) return '';

    // если уже полный URL — ничего не делаем
    if (path.startsWith('http')) {
        return path;
    }

    // если путь уже начинается с /api
    if (path.startsWith('/api')) {
        return `${API_URL.replace('/api', '')}${path}`;
    }

    // если обычный путь
    return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
}