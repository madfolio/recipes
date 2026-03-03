import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";
import WeeklyPlanner from "../components/WeeklyPlanner";
import { useRecipes } from "../hooks/useRecipes";

export default function Home() {
    const recipes = useRecipes();
    const [searchParams, setSearchParams] = useSearchParams();

    const search = searchParams.get("q") ?? "";

    const setSearch = (value: string) => {
        const next = value.trim();
        if (!next) {
            setSearchParams({}, { replace: true });
        } else {
            setSearchParams({ q: next }, { replace: true });
        }
    };

    const displayedRecipes = useMemo(() => {
        const terms = search.toLowerCase().split(" ").filter(Boolean);

        return recipes.filter((recipe) => {
            if (terms.length === 0) return true;

            return terms.every((term) => {
                const inTitle = recipe.title.toLowerCase().includes(term);
                const inDescription = recipe.description.toLowerCase().includes(term);
                const inTags = (recipe.tags ?? []).some((t) => t.toLowerCase().includes(term));
                const inIngredients = (recipe.ingredients ?? []).some((i) =>
                    (i.name ?? "").toLowerCase().includes(term)
                );

                return inTitle || inDescription || inTags || inIngredients;
            });
        });
    }, [recipes, search]);

    return (
        <div className="max-w-7xl mx-auto p-6 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <h1 className="text-4xl font-bold mb-4">Our Recipes</h1>

                <input
                    type="text"
                    placeholder="Search (title, tags, ingredients...)"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-6 p-2 rounded border w-full"
                />

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
                    {displayedRecipes.map((r) => (
                        <RecipeCard key={r.id} recipe={r} />
                    ))}
                </div>
            </div>

            <div>
                <WeeklyPlanner recipes={recipes} />
            </div>
        </div>
    );
}
