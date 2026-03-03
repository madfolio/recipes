import { useMemo, useState } from "react";
import { Recipe } from "../types/recipe";
import { useMealPlanner, WeekPlan } from "../hooks/useMealPlanner";
import { getWeekKey, shiftWeekKey, compareWeekKeys } from "../utils/date";

type Props = { recipes: Recipe[] };

const DAY_LABELS: Array<{ key: keyof WeekPlan; label: string }> = [
    { key: "saturday", label: "Sat" },
    { key: "sunday", label: "Sun" },
    { key: "monday", label: "Mon" },
    { key: "tuesday", label: "Tue" },
    { key: "wednesday", label: "Wed" },
    { key: "thursday", label: "Thu" },
    { key: "friday", label: "Fri" }
];

export default function WeeklyPlanner({ recipes }: Props) {
    const currentWeekKey = useMemo(() => getWeekKey(new Date()), []);
    const [selectedWeekKey, setSelectedWeekKey] = useState(currentWeekKey);

    const isPastWeek = compareWeekKeys(selectedWeekKey, currentWeekKey) < 0;
    const { plan, updateDay } = useMealPlanner(selectedWeekKey, !isPastWeek);

    const recipeTitleById = useMemo(() => {
        const map = new Map<string, string>();
        for (const r of recipes) map.set(r.id, r.title);
        return map;
    }, [recipes]);

    function buildShoppingList() {
        const byId = new Map(recipes.map((r) => [r.id, r]));
        const totals = new Map<string, { name: string; unit: string; amount: number }>();

        for (const { key: dayKey } of DAY_LABELS) {
            const recipeId = plan[dayKey];
            if (!recipeId) continue;

            const recipe = byId.get(recipeId);
            if (!recipe) continue;

            for (const ing of recipe.ingredients ?? []) {
                const name = (ing.name ?? "").trim();
                const unit = (ing.unit ?? "").trim();
                const amount = Number(ing.amount ?? 0);

                if (!name) continue;

                const mapKey = `${name.toLowerCase()}|${unit.toLowerCase()}`;
                const existing = totals.get(mapKey);

                if (existing) {
                    existing.amount += Number.isFinite(amount) ? amount : 0;
                } else {
                    totals.set(mapKey, {
                        name,
                        unit,
                        amount: Number.isFinite(amount) ? amount : 0
                    });
                }
            }
        }

        const items = Array.from(totals.values()).sort((a, b) =>
            a.name.localeCompare(b.name)
        );

        return {
            weekStart: selectedWeekKey,
            range: "Sat–Fri",
            items
        };
    }

    function downloadJson(filename: string, data: unknown) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();

        URL.revokeObjectURL(url);
    }


    return (
        <div className="bg-white rounded-2xl shadow-md p-4 sticky top-4">
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={() => setSelectedWeekKey(shiftWeekKey(selectedWeekKey, -1))}
                    className="px-2 py-1 rounded hover:bg-neutral-100"
                    aria-label="Previous week"
                >
                    ←
                </button>

                <div className="text-sm font-semibold">
                    Week of {selectedWeekKey} (Sat–Fri)
                </div>

                <button
                    onClick={() => setSelectedWeekKey(shiftWeekKey(selectedWeekKey, 1))}
                    className="px-2 py-1 rounded hover:bg-neutral-100"
                    aria-label="Next week"
                >
                    →
                </button>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <div className="text-lg font-bold">Supper plan</div>
                    {isPastWeek && (
                        <span className="text-xs text-neutral-600 bg-neutral-100 px-2 py-1 rounded-full">
                            Archived
                        </span>
                    )}
                </div>

                <button
                    onClick={() => {
                        const list = buildShoppingList();
                        downloadJson(`shopping-list-${selectedWeekKey}.json`, list);
                    }}
                    className="mt-3 w-full px-3 py-2 rounded-xl border hover:bg-neutral-50 text-sm"
                >
                    Export ingredients for this week
                </button>
            </div>


            <div className="space-y-2">
                {DAY_LABELS.map(({ key, label }) => (
                    <div
                        key={key}
                        onDragOver={(e) => {
                            if (!isPastWeek) e.preventDefault();
                        }}
                        onDrop={(e) => {
                            if (isPastWeek) return;
                            const recipeId = e.dataTransfer.getData("text/plain");
                            if (recipeId) updateDay(key, recipeId);
                        }}
                        className={`border rounded-xl p-3 min-h-[64px] ${isPastWeek ? "bg-neutral-50" : "bg-white"
                            }`}
                    >
                        <div className="text-xs font-semibold text-neutral-600">{label}</div>
                        <div className="text-sm mt-1">
                            {plan[key] ? (recipeTitleById.get(plan[key]!) ?? plan[key]) : "—"}
                        </div>
                        {!isPastWeek && (
                            <div className="text-[11px] text-neutral-500 mt-1">
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
