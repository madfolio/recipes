import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecipeImage from "../components/RecipeImage";
import { useRecipes } from "../hooks/useRecipes";
import { toApiUrl } from "../utils/api";

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function RecipeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const recipes = useRecipes();

  const recipe = useMemo(() => recipes.find((r) => r.id === id), [recipes, id]);

  if (!recipe) return <div className="p-6">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Back
      </button>

      {recipe.image && (
        <RecipeImage
          src={toApiUrl(recipe.image.replace(/^\.\//, "/"))}
          alt={recipe.title}
          className="rounded-2xl mb-6 w-full object-cover"
          placeholderClassName="rounded-2xl mb-6 h-64 w-full bg-neutral-100"
        />
      )}

      <h1 className="text-4xl font-bold mb-2">{recipe.title}</h1>

      {!!recipe.tags?.length && (
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.tags.map((tag) => (
            <button
              key={tag}
              onClick={() => navigate(`/?q=${encodeURIComponent(tag)}`)}
              className="text-xs px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200"
              title={`Search for ${tag}`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {recipe.context && (
        <p className="italic text-neutral-600 mb-4 text-lg">{recipe.context}</p>
      )}

      {recipe.sourceUrl && (
        <a
          href={recipe.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-block mb-6 text-blue-600 hover:underline"
        >
          Source: {getDomain(recipe.sourceUrl)}
        </a>
      )}

      <p className="mb-6">{recipe.description}</p>

      <div className="grid grid-cols-3 gap-3 mb-8 text-sm">
        <div className="bg-white rounded-xl border p-3">
          <div className="text-neutral-500">Prep</div>
          <div className="font-semibold">{recipe.prepTime} min</div>
        </div>
        <div className="bg-white rounded-xl border p-3">
          <div className="text-neutral-500">Cook</div>
          <div className="font-semibold">{recipe.cookTime} min</div>
        </div>
        <div className="bg-white rounded-xl border p-3">
          <div className="text-neutral-500">Servings</div>
          <div className="font-semibold">{recipe.servings}</div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
        <ul className="space-y-2">
          {recipe.ingredients.map((i, idx) => (
            <li key={idx} className="flex gap-2">
              <span className="font-semibold">
                {i.amount} {i.unit}
              </span>
              <span>{i.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-3">Instructions</h2>
        <ol className="list-decimal list-inside space-y-2">
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
