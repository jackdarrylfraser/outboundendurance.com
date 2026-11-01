# Copilot Instructions

This repository is a Zola static-site project. Follow the existing structure, configuration, and templating conventions when modifying or adding to the site.

## Project Structure

- `zola.toml` — Site-wide configuration. Keep settings here; do not introduce secondary config files.
- `content/` — Markdown pages and sections. Use `_index.md` for sections and `index.md` for standalone pages.
- `templates/` — Tera templates. Follow the template style guide below; extend or include existing templates instead of duplicating markup.
- `sass/` — Sass stylesheets compiled automatically by Zola (`compile_sass = true`).
- `static/` — Assets copied directly to output. Reference them via site-relative paths.
- `themes/` — Local themes, if adopted. Do not assume a theme is active unless specified.

## Content & Assets

- Write content in Markdown within `content/` using TOML front matter (`+++`).
- Include only required front-matter fields (e.g., `title`, `date`, `description`, `draft`).
- Put section metadata and section-level template choices in `_index.md`. Use explicit `path` attributes only when a custom URL structure is required.
- Store raw images, fonts, and media in `static/`.
- Maintain existing architecture within `sass/` for style adjustments.

## Tera Templating Conventions

Follow these rules to minimize indentation, eliminate local state duplication, and keep data access predictable:

### 1. Direct Canonical Access (No Local Re-assignment)

Never create local aliases at the top of templates (e.g., avoid `{% set page_title = page.title %}`).

- Read directly from the canonical source: `{{ page.title }}`, `{{ config.extra.analytics_id }}`, `{{ section.pages }}`.
- Reserve `{% set %}` strictly for capturing transformed output inside loops or shaping complex payloads for macro invocation.

### 2. Clean HTML Lines Over In-Attribute Templating Logic

Keep HTML attributes clean and free of inline ternary/conditional logic. Prefer rendering separate, unnested HTML lines when markup variants depend on conditions:

```tera
{# BAD: In-attribute/class templating logic #}
<span class="badge{{ page.extra.featured | ternary(true=" featured", false="") }}">Post</span>

{# GOOD: Explicit, clean HTML lines per state #}
{% if page.extra.featured %}
<span class="badge featured">Featured Post</span>
{% else %}
<span class="badge">Standard Post</span>
{% endif %}
```
