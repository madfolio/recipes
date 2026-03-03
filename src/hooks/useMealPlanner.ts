import { useEffect, useState } from "react";

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


const API_BASE_URL = "http://localhost:4000";

export function useMealPlanner(weekKey: string, isEditable: boolean) {
    const [plan, setPlan] = useState<WeekPlan>(EMPTY_WEEK);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            const res = await fetch(`${API_BASE_URL}/planner/${weekKey}`);
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

        const updated = { ...plan, [day]: recipeId };
        setPlan(updated);

        await fetch(`${API_BASE_URL}/planner/${weekKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated)
        });
    }

    return { plan, updateDay };
}
