(function () {
  const q = document.getElementById("q");
  const tag = document.getElementById("tag");
  const list = document.getElementById("recipes");
  if (!q || !tag || !list) return;

  const items = Array.from(list.querySelectorAll(".item"));

  function apply() {
    const query = (q.value || "").trim().toLowerCase();
    const t = (tag.value || "").trim().toLowerCase();

    items.forEach((el) => {
      const title = el.getAttribute("data-title") || "";
      const tags = el.getAttribute("data-tags") || "";
      const okQuery = !query || title.includes(query) || tags.includes(query);
      const okTag = !t || tags.split(/\s+/).includes(t);
      el.style.display = (okQuery && okTag) ? "" : "none";
    });
  }

  q.addEventListener("input", apply);
  tag.addEventListener("change", apply);
})();
