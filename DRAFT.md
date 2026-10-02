**Title:** Soft navigation into a nested layout scrolls past the new layout to the page

### Link to the code that reproduces this issue

https://github.com/stefanprobst/next-nested-layout-scroll-repro

### To Reproduce

1. `pnpm install && pnpm build && pnpm start`
2. Open `http://localhost:3000/` in a viewport about 800px tall, scrolled to the top.
3. Click "Section".

Or run `node repro.mjs`, which does this in Chromium, Firefox and WebKit, also for "Flat", and prints `scrollY` after
each navigation.

### Current vs. Expected behavior

`/section` has a nested layout, `app/section/layout.jsx`, which renders a heading and an intro taller than the viewport
above `{children}`. Its page renders only the content below.

**Current:** after clicking "Section", the page is scrolled to the page segment's content (`scrollY` 1040), so the
section's heading and intro are above the viewport. The user never sees the top of the page they navigated to.

**Expected:** the page opens at the top (`scrollY` 0), as it does for `/flat`, which renders the same markup without a
nested layout.

The navigation mounts the layout as well as the page, so the layout's content is just as new as the page's. Scrolling
to the page makes sense when the layout was already rendered and only the page changed, e.g. tabs in a shared layout
that switch between sibling routes, but not when the layout itself is new.

| link | `scrollY` after navigation | expected |
| --- | --- | --- |
| Section (nested layout) | 1040 | 0 |
| Flat (same markup, no nested layout) | 0 | 0 |

Same in Chromium 153, Firefox 155 and WebKit 26.6.

### Provide environment information

```bash
Operating System:
  Platform: linux
  Arch: x64
  Version: #34~24.04.1-Ubuntu SMP PREEMPT_DYNAMIC Fri Sep  4 15:38:29 UTC 2
  Available memory (MB): 32035
  Available CPU cores: 4
Binaries:
  Node: 24.21.0
  npm: N/A
  Yarn: N/A
  pnpm: 12.8.1
Relevant Packages:
  next: 16.4.0-canary.57 // Latest available version is detected (16.4.0-canary.57).
  eslint-config-next: N/A
  react: 19.3.0
  react-dom: 19.3.0
  typescript: N/A
Next.js Config:
  output: N/A
```

### Which area(s) are affected? (Select all that apply)

Linking and Navigating

### Which stage(s) are affected? (Select all that apply)

`next dev` (local), `next build` (local), `next start` (local)

### Additional context

Also happens on 16.3.7.

The scroll ref is only assigned to leaf segments, in `render-tree.ts`:

```ts
const isLeafSegment = newSlots === null;
if (isLeafSegment) {
	accumulateScrollRef(freshness, newRenderTree.data, accumulation);
}
```

That includes `createRenderTreeOnNavigation`, which is entered at the first segment that was not part of the previous
route. Assigning the scroll ref to that segment, the topmost new one, would fix this: when it is the page, the behavior
stays the same; when it is a layout, the user sees the new layout from its top.

The `<Link>` docs on `scroll` only describe the page case ("if the Page is not visible in the viewport, Next.js will
scroll to the top of the first Page element"), and do not mention nested layouts.

Workaround: render an absolutely positioned marker at the top of the document as the page's first element, so it
becomes the scroll target.
