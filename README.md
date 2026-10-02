# Navigating into a nested layout scrolls past it, to the page

A soft navigation scrolls to the first element of the new **page** (if it is not already in the viewport). When the
navigation also mounts a new **layout** above that page, the layout's content is new as well, but the scroll target is
still the page, so the user lands below the layout's heading and intro, which they have never seen.

`/section` and `/flat` render the same markup: a heading, an intro taller than the viewport, then the page's content.
`/section` puts the heading and intro in `app/section/layout.jsx`, `/flat` has everything in its page. Navigating to
either from `/`, scrolled to the top:

| link | `scrollY` after navigation | expected |
| --- | --- | --- |
| Section | 1040 ❌ (the heading is 1019px above the viewport) | 0 |
| Flat | 0 | 0 |

Scrolling to the page is reasonable when the layout was already rendered and only the page changed (e.g. tabs in a shared
layout switching between sibling routes). It is not when the layout is new.

## Versions

- `next` 16.4.0-canary.57 (also 16.3.7), `react` 19.3.0
- Node 24.21.0, pnpm 12.8.1, Linux
- Chromium 153, Firefox 155, WebKit 26.6 (Playwright 1.63.0); same results in all three

## Reproduce

```sh
pnpm install
pnpm build
node repro.mjs

DEV=1 node repro.mjs   # same result with `next dev`
```

`repro.mjs` starts `next start`, opens `/` in a 1280×800 viewport, clicks each link, and records `scrollY` and the
`<h1>`'s position. Output: [out.md](./out.md). By hand: `pnpm build && pnpm start`, click "Section" and see the page open
on the blue page content, scrolled past the yellow intro and the heading.

## Cause

`accumulateScrollRef` (`packages/next/src/client/components/render-tree.ts`) only assigns the navigation's scroll ref to
leaf segments:

```js
const isLeafSegment = newSlots === null;
if (isLeafSegment) {
	accumulateScrollRef(freshness, newRenderTree.data, accumulation);
}
```

including in `createRenderTreeOnNavigation`, which is entered at the first segment that was not part of the previous
route. That segment, the topmost new one, is where scrolling should go: when it is the page, nothing changes; when it is
a layout, the user sees the new layout from its top.

The docs on `<Link>`'s `scroll` prop only describe the page case ("Next.js will scroll to the top of the first Page
element"), and do not mention nested layouts.
