export function getImageUrl(path) {
    if (!path) return '';

    if (path.startsWith('http')) {
        return path;
    }

    // если путь уже с /api — не трогаем
    if (path.startsWith('/api')) {
        return `http://localhost:8080${path}`;
    }

    // если без /api — добавляем
    return `http://localhost:8080/api${path}`;
}