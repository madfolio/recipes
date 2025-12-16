---
layout: default
title: Tags
---

<p class="eyebrow">Browse</p>
<h1 class="title">Tags</h1>

{% assign all_tags = "" | split: "" %}
{% for r in site.recipes %}
  {% for t in r.tags %}
    {% assign all_tags = all_tags | push: t %}
  {% endfor %}
{% endfor %}
{% assign all_tags = all_tags | uniq | sort %}

<div class="card">
  <div class="tags">
    {% for t in all_tags %}
      <a class="tag" href="#{{ t | slugify }}">{{ t }}</a>
    {% endfor %}
  </div>
</div>

{% for t in all_tags %}
  <h2 id="{{ t | slugify }}">{{ t }}</h2>
  <ul class="list">
    {% for r in site.recipes %}
      {% if r.tags contains t %}
        <li class="item">
          <a href="{{ r.url | relative_url }}">{{ r.title }}</a>
        </li>
      {% endif %}
    {% endfor %}
  </ul>
{% endfor %}
