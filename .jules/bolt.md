# Bolt's Journal - Critical Learnings Only

## 2025-01-23 - DOM Optimization with DocumentFragment and textContent
**Learning:** In a vanilla JS application, frequent updates to a list (like agent statuses) using `innerHTML` and individual `appendChild` calls cause unnecessary reflows. Combining `DocumentFragment` with `textContent` for text nodes significantly reduces layout overhead and improves security by avoiding the HTML parser.
**Action:** Always prefer `DocumentFragment` for batching DOM updates and `textContent` over `innerHTML` for plain text content.
