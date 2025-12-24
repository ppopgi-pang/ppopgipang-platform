export function formatRelativeTime(timestamp: number): string {
    const now = Date.now();
    const diff = now - timestamp;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diff < minute) {
        return '방금 전';
    } else if (diff < hour) {
        return `${Math.floor(diff / minute)}분 전`;
    } else if (diff < day) {
        return `${Math.floor(diff / hour)}시간 전`;
    } else if (diff < 7 * day) {
        return `${Math.floor(diff / day)}일 전`;
    } else {
        const date = new Date(timestamp);
        return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`;
    }
}
