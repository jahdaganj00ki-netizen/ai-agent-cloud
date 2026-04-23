## 2026-01-24 - Warmup Effect in DOM Benchmarking
**Learning:** Initial DOM updates (like the first message in a session) often show significantly higher execution times (up to 20ms) compared to subsequent updates (sub-1ms). This is due to browser JIT compilation, initial layout calculations, and resource initialization.
**Action:** When benchmarking small performance improvements, always perform multiple "warmup" runs before recording baseline and optimized metrics to ensure consistent results.

## 2026-01-24 - Scalable DOM Updates
**Learning:** In a small application, the performance difference between `innerHTML` and `DocumentFragment`/`textContent` is negligible in raw milliseconds, but the architectural benefit grows exponentially with the number of DOM nodes.
**Action:** Prioritize `textContent` and `DocumentFragment` from the start to ensure O(1) layout reflows regardless of list size.
