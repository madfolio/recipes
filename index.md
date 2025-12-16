---
layout: default
title: Home
---

<p class="eyebrow">Welcome</p>
<h1 class="title">Recipes, in ink.</h1>

<div class="card">
  <p>
    A simple black-and-white recipe book. No photos. Just words, timing, and a little handwriting.
  </p>

  <div class="controls">
    <input id="q" type="search" placeholder="Search titles and tags…" aria-label="Search" />
    <select id="tag" aria-label="Filter by tag">
      <option value="">All tags</option>
      {% assign all_tags = "" | split: "" %}
      {% for r in site.recipes %}
        {% for t in r.tags %}
          {% assign all_tags = all_tags | push: t %}
        {% endfor %}
      {% endfor %}
      {% assign all_tags = all_tags | uniq | sort %}
      {% for t in all_tags %}
        <option value="{{ t | downcase }}">{{ t }}</option>
      {% endfor %}
    </select>
  </div>

  <ul id="recipes" class="list">
    {% for r in site.recipes %}
      <li class="item"
          data-title="{{ r.title | downcase }}"
          data-tags="{{ r.tags | join: ' ' | downcase }}">
        <a href="{{ r.url | relative_url }}">{{ r.title }}</a>
        <div class="meta">
          {% if r.servings %}<span><span class="meta__label">Makes</span> {{ r.servings }}</span>{% endif %}
          {% if r.prep_time %}<span><span class="meta__label">Prep</span> {{ r.prep_time }}</span>{% endif %}
          {% if r.cook_time %}<span><span class="meta__label">Cook</span> {{ r.cook_time }}</span>{% endif %}
          {% if r.chill_time %}<span><span class="meta__label">Chill</span> {{ r.chill_time }}</span>{% endif %}
        </div>
        {% if r.tags %}
          <div class="tags">
            {% for t in r.tags %}
              <span class="tag" aria-hidden="true">{{ t }}</span>
            {% endfor %}
          </div>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
</div>
