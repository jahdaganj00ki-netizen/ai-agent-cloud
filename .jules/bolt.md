## 2026-02-03 - DOM Rendering Optimization
**Learning:** Initial baseline for rendering 100 messages in `public/js/app.js` using `innerHTML` and a slow `escapeHtml` was ~51.80ms. The use of `innerHTML` and multiple DOM appends in loops was a clear bottleneck.
**Action:** Replaced `innerHTML` with `textContent` and used `DocumentFragment` for batching updates. Implemented throttled scrolling with `requestAnimationFrame`.
**Result:** Rendering time for 100 messages reduced from 51.80ms to ~0.40ms (synchronous execution time), a ~99% reduction in JS execution time for DOM updates.
