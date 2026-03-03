import { Link } from "react-router-dom";
import { Recipe } from "../types/recipe";
import { toApiUrl } from "../utils/api";


type Props = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: Props) {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", recipe.id);
        e.dataTransfer.effectAllowed = "copy";
      }}
      className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4"
      title="Drag to planner"
    >
      {recipe.image ? (
              <img
                  src={toApiUrl(recipe.image.replace(/^\.\//, "/"))}
                  alt={recipe.title}
                  className="rounded-xl mb-3 h-40 w-full object-cover"
                  loading="lazy"
              />
      ) : (
        <div className="rounded-xl mb-3 h-40 w-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm">
          No image
        </div>
      )}

      <h2 className="text-xl font-semibold leading-snug">{recipe.title}</h2>

      {recipe.description ? (
        <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
          {recipe.description}
        </p>
      ) : null}

      {recipe.tags?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {recipe.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-neutral-100 text-neutral-700"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
