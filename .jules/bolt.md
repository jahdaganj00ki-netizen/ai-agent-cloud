# Bolt's Performance Journal

## 2026-02-06 - Optimized DOM Performance & Scroll Responsiveness
**Learning:** Redundant DOM round-trips (innerHTML + escapeHtml) and unthrottled scroll events can significantly impact UI responsiveness as the chat history grows. Using `textContent` is not only faster but also provides a built-in security layer against XSS.
**Action:** Always prefer `textContent` for user-generated content and use `requestAnimationFrame` to throttle layout-heavy operations like `scrollTop`.
