/**
 * Week starts on Saturday by default.
 * JS Date.getDay(): 0=Sun, 1=Mon, ... 6=Sat
 */
const WEEK_START_DAY = 6;

function atLocalMidnight(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function getWeekStart(date: Date, weekStartDay: number = WEEK_START_DAY): Date {
    const d = atLocalMidnight(date);
    const day = d.getDay();
    const diff = (day - weekStartDay + 7) % 7; // days since week start
    d.setDate(d.getDate() - diff);
    return d;
}

export function formatDateKey(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const da = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${da}`;
}

/**
 * Stable key for storage/history: the week-start date (Saturday).
 */
export function getWeekKey(date: Date, weekStartDay: number = WEEK_START_DAY): string {
    return formatDateKey(getWeekStart(date, weekStartDay));
}

export function shiftWeekKey(weekKey: string, offsetWeeks: number): string {
    // weekKey format: YYYY-MM-DD
    const [y, m, d] = weekKey.split("-").map(Number);
    const base = new Date(y, m - 1, d);
    base.setDate(base.getDate() + offsetWeeks * 7);
    return formatDateKey(base);
}

export function compareWeekKeys(a: string, b: string): number {
    // since keys are YYYY-MM-DD, lexicographic compare works
    // but return numeric for clarity
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}
