import { useEffect, useState } from "react";
import { toApiUrl } from "../utils/api";

export type WeekPlan = {
    saturday: string | null;
    sunday: string | null;
    monday: string | null;
    tuesday: string | null;
    wednesday: string | null;
    thursday: string | null;
    friday: string | null;
};

const EMPTY_WEEK: WeekPlan = {
    saturday: null,
    sunday: null,
    monday: null,
    tuesday: null,
    wednesday: null,
    thursday: null,
    friday: null
};

export function useMealPlanner(weekKey: string, isEditable: boolean) {
    const [plan, setPlan] = useState<WeekPlan>(EMPTY_WEEK);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            const res = await fetch(toApiUrl(`/planner/${weekKey}`));
            if (!res.ok) {
                throw new Error(`Unable to load planner for week: ${weekKey}`);
            }

            const data = await res.json();
            if (!cancelled) setPlan(data ?? EMPTY_WEEK);
        }

        load().catch(() => {
            if (!cancelled) setPlan(EMPTY_WEEK);
        });

        return () => {
            cancelled = true;
        };
    }, [weekKey]);

    async function updateDay(day: keyof WeekPlan, recipeId: string) {
        if (!isEditable) return;

        const previous = plan;
        const updated = { ...plan, [day]: recipeId };
        setPlan(updated);

        try {
            const res = await fetch(toApiUrl(`/planner/${weekKey}`), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated)
            });

            if (!res.ok) {
                throw new Error(`Unable to save planner for week: ${weekKey}`);
            }
        } catch (error) {
            console.error(error);
            setPlan(previous);
        }
    }

    return { plan, updateDay };
}
