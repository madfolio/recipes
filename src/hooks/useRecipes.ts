
import { useEffect, useState } from "react";
import { Recipe } from "../types/recipe";

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    async function load() {
      const modules = import.meta.glob("/public/recipes/*.json");
      const loaded: Recipe[] = [];

      for (const path in modules) {
        const mod: any = await modules[path]();
        loaded.push(mod.default);
      }

      setRecipes(loaded);
    }

    load();
  }, []);

  return recipes;
}
