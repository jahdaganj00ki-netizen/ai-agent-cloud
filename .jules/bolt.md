# Bolt's Journal - Critical Learnings

## 2025-02-04 - DOM Performance Bottlenecks
**Learning:** Repetitive use of `innerHTML` combined with synchronous `scrollTop` updates causes significant layout thrashing when processing many messages. Batching scroll updates with `requestAnimationFrame` and using `textContent` for message content provides a massive performance boost.
**Action:** Always prefer `textContent` over `innerHTML` for dynamic content and throttle layout-heavy operations like scrolling using `requestAnimationFrame`.
