## 2026-02-02 - [DOM Rendering & Scroll Optimization]
**Learning:** Batching DOM updates with `DocumentFragment` and throttling scroll events with `requestAnimationFrame` significantly reduces layout thrashing and reflows. Avoiding `innerHTML` in favor of `textContent` and `createElement` not only improves performance by bypassing the HTML parser but also enhances security.
**Action:** Always prefer `textContent` for plain text updates and `requestAnimationFrame` for UI-heavy synchronous operations like scrolling to the bottom of a chat container.
