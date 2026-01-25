# BOLT'S JOURNAL - CRITICAL LEARNINGS ONLY

## 2024-05-15 - DOM Reflows and HTML Parsing
**Learning:** In vanilla JavaScript applications, frequent `innerHTML` updates and direct DOM appends in loops are major performance bottlenecks. They trigger unnecessary layout reflows and expensive HTML parsing.
**Action:** Always prefer `textContent` and `document.createElement` over `innerHTML` when possible. Use `DocumentFragment` to batch multiple DOM insertions.
