
import { useEffect, useState } from "react";
import { Recipe } from "../types/recipe";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const indexResponse = await fetch("/recipes/index.json");
      const recipeFiles: string[] = await indexResponse.json();

      const loaded = await Promise.all(
        recipeFiles.map(async (file) => {
          const recipeResponse = await fetch(`/recipes/${file}`);
          return (await recipeResponse.json()) as Recipe;
        })
      );

      if (!cancelled) {
        setRecipes(loaded);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, []);

  return recipes;
}
