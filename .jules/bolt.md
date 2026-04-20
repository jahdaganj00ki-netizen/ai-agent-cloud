## 2026-01-30 - DOM Performance & Security Optimization
**Learning:** Replacing `innerHTML` with `textContent` and direct DOM element creation (`createElement`, `createTextNode`) avoids the overhead of the HTML parser and improves security by preventing XSS. Using `DocumentFragment` for batching DOM updates significantly reduces layout reflows, especially in loops.

**Action:** Always prefer `textContent` and `DocumentFragment` for high-performance UI updates in vanilla JavaScript. Avoid including internal verification artifacts (screenshots, test scripts) and unnecessary lockfiles in the final submission to maintain repository hygiene.
