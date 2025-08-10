# FastLoad v0.0.1

**Single-tag performance loader** — Load only critical UI first, reveal the rest after user interaction, page load, or idle time.

## Features
- Just **one `<script>` tag**
- `data-fastload="true"` to show immediately
- Everything else hidden at first paint
- Auto reveal after:
  - First user interaction
  - `window.load` event
  - Idle timeout (`data-idle-timeout`)
- Images in fastload blocks are loaded eagerly (`fetchpriority=high`)

## Usage
```html
<script src="dist/fastload-0.0.1.min.js"
        data-debug="true"
        data-idle-timeout="2000"></script>

<header data-fastload="true">Header</header>
<aside data-fastload="true">Sidebar</aside>
<main>Heavy content</main>
```

## Options (data-* attributes on <script>)

- data-debug="true" — enable debug logs
- data-idle-timeout="ms" — reveal after given idle time (default: 1800ms)