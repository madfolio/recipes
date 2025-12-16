# Recipe Book (GitHub Pages + Markdown)

This is a minimal, black-and-white recipe website designed for **GitHub Pages**.

## Add a new recipe
Create a new Markdown file in `_recipes/` with front matter like:

```yml
---
title: "My recipe"
tags: ["dessert", "quick"]
servings: "2"
prep_time: "10 mins"
cook_time: "15 mins"
source: "Optional"
source_url: "Optional"
---
```

Then write the recipe in Markdown below the front matter.

## Publish on GitHub Pages
1. Push this repo to GitHub.
2. Go to **Settings → Pages**
3. Select your branch (usually `main`) and choose the root folder.
4. Save.

If you are using a project site (URL looks like `https://USER.github.io/REPO/`), set `baseurl: "/REPO"` in `_config.yml`.
