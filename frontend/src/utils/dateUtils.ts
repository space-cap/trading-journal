import type { TFunction } from 'i18next';

/**
 * 상대 시간을 계산하여 반환합니다.
 * 예: "5일 전", "1주일 전", "방금 전"
 */
export function formatRelativeTime(dateString: string, t: TFunction): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 1) return t('relativeTime.justNow');
    if (diffMins < 60) return t('relativeTime.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('relativeTime.hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('relativeTime.daysAgo', { count: diffDays });
    if (diffWeeks < 4) return t('relativeTime.weeksAgo', { count: diffWeeks });
    return t('relativeTime.monthsAgo', { count: diffMonths });
}

/**
 * 날짜를 "MM/DD" 형식으로 포맷합니다.
 * 예: "11/20"
 */
export function formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}/${day}`;
}
