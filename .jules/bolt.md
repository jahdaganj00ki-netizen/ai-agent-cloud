## 2025-05-15 - DOM Optimization in Chat Interface
**Learning:** Replacing `innerHTML` with `textContent` and using `DocumentFragment` for list rendering significantly reduces DOM operation time. `innerHTML` triggers the HTML parser, which is expensive for simple text updates. `DocumentFragment` minimizes layout reflows by batching multiple appends into a single DOM update.
**Action:** Always prefer `textContent` for raw text updates and use `DocumentFragment` when appending multiple elements to the DOM in a loop.
