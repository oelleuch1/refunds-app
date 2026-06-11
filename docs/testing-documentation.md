# Testing Documentation — Vitest + @open-wc/testing (with Vue Test Utils comparison)

Reference for writing professional unit tests in this project, written for someone who already knows **Vitest + Vue Test Utils** and is mapping that knowledge onto **Lit / Web Components**.

Every section pairs the Lit/`@open-wc` API we use with its **Vue Test Utils (VTU)** equivalent so you can translate intuition directly.

**Stack:**

- **Vitest 4** — test runner, mocking, lifecycle hooks (`environment: jsdom`, `globals: true`). _Same runner Vue projects use._
- **@open-wc/testing 4** — Lit/Web Component fixtures + Chai-style assertions (`expect(...).to.*`). _This is the part that replaces `@vue/test-utils`._

### The big mental-model shift from Vue

| Concept                | Vue Test Utils                                    | Lit + @open-wc/testing                                   |
| ---------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| Mount a component      | `mount(Component, { props })` → `wrapper`         | `await fixture(html\`<x-el .p=${v}></x-el>\`)`→`Element` |
| The thing you get back | A **wrapper** object (`wrapper.vm`, `.find`…)     | The **real DOM element** (`el.shadowRoot`, `el.prop`)    |
| Where markup lives     | `wrapper.find(...)` (light DOM)                   | `el.shadowRoot!.querySelector(...)` (**shadow** DOM)     |
| Wait for re-render     | `await nextTick()` / `await wrapper.vm.$nextTick` | `await el.updateComplete`                                |
| Assertion style        | Jest-style `expect(x).toBe(y)`                    | Chai-style `expect(x).to.equal(y)`                       |
| Read emitted events    | `wrapper.emitted('name')`                         | `await oneEvent(el, 'name')` or a listener spy           |
| Set a prop after mount | `await wrapper.setProps({ p })`                   | `el.p = v; await el.updateComplete`                      |

The single most common bug when coming from Vue: forgetting that Web Components render into a **shadow root**, so `el.querySelector` finds nothing — you must go through `el.shadowRoot`.

**Important — two `expect`s exist:**

- `expect` from `@open-wc/testing` → **Chai** syntax (`.to.equal`, `.to.contain`). This is what we use across the project.
- `expect` from `vitest` → **Jest** syntax (`.toBe`, `.toContain`) — _the one VTU tutorials use._ Don't mix them in the same file. Our convention: import `expect` from `@open-wc/testing`, import everything else (`vi`, `describe`, `it`, hooks) from `vitest`.

```ts
import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import { vi, describe, beforeEach, afterEach, it } from "vitest";
```

> In a Vue project you'd instead write `import { mount } from "@vue/test-utils"` and `import { expect, vi, describe, it } from "vitest"` — one `expect`, Jest-style.

---

## 1. Test structure (Vitest)

> **Identical to Vue.** `describe`/`it`/modifiers come from Vitest, not from the component library, so this layer is the same whether you test Vue or Lit.

### `describe(name, fn)`

Groups related tests. Can be nested for sub-suites.

```ts
describe("app-data-table", () => {
  describe("pagination", () => {
    /* ... */
  });
});
```

### `it(name, fn)` / `test(name, fn)`

Defines a single test. Aliases — `it` reads better with behavior names.

```ts
it("renders headers", async () => {
  /* ... */
});
```

### Modifiers

| Modifier                             | Purpose                                                 |
| ------------------------------------ | ------------------------------------------------------- | --------------------------------------- |
| `it.only(...)`                       | Run **only** this test (and other `.only`s). Debugging. |
| IMPORTANT                            | `it.skip(...)`                                          | Skip this test.                         |
| `it.todo("name")`                    | Placeholder, reported as todo.                          |
| IMPORTANT                            | `it.each([...])(name, fn)`                              | Parameterized — runs once per data row. |
| `it.fails(...)`                      | Asserts the test is expected to throw/fail.             |
| `it.runIf(cond)` / `it.skipIf(cond)` | Conditionally run/skip based on a boolean.              |
| `it.concurrent(...)`                 | Run sibling `.concurrent` tests in parallel.            |
| `describe.each([...])`               | Parameterize an entire suite.                           |

it('describing the piece of unit test', () => {

})

```ts
it.each([
  { input: 1, expected: "1" },
  { input: 10, expected: "10" },
])("formats $input → $expected", ({ input, expected }) => {
  expect(format(input)).to.equal(expected);
});
```

---

## 2. Lifecycle hooks (Vitest)

> **Identical to Vue.** Same four hooks, same scoping rules. The only difference is _what_ you set up inside them (stores/spies vs. Vue plugins).

| Hook            | Runs                                |
| --------------- | ----------------------------------- | ------------------------------------------------- |
| `beforeAll(fn)` | Once before all tests in the scope. |
| `afterAll(fn)`  | Once after all tests in the scope.  |
| IMPORTANT       | `beforeEach(fn)`                    | Before **every** test — set up fresh state.       |
| IMPORTANT       | `afterEach(fn)`                     | After **every** test — clean up (restore mocks!). |

Scope follows the `describe` they're declared in. Always restore mocks in `afterEach` to prevent leakage between tests:

```ts
beforeEach(() => {
  vi.spyOn(ordersStore, "getOrders").mockResolvedValue(undefined);
  ordersStore.state = { orders: [], isLoading: false /* ... */ };
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

> **VTU note:** In Vue you typically also call `wrapper.unmount()` in `afterEach`. With `@open-wc` the fixture is **auto-removed** after each test, so you rarely need manual teardown (see `fixtureCleanup` in §3).

---

## 3. Component fixtures (@open-wc/testing) — the `mount()` replacement

This is the section that maps directly onto VTU's `mount` / `shallowMount`.

| Vue Test Utils                        | @open-wc/testing                                   |
| ------------------------------------- | -------------------------------------------------- |
| `mount(Comp, { props: { p: v } })`    | `await fixture(html\`<x-el .p=${v}></x-el>\`)`     |
| `shallowMount(Comp)` (stubs children) | _No direct equivalent_ — see note below            |
| `mount(Comp, { attrs: { id: "x" } })` | `html\`<x-el id="x"></x-el>\`` (attribute binding) |
| returns `wrapper`                     | returns the actual `Element`                       |

> There is no built-in `shallowMount`. Web Components don't stub children automatically; if you need isolation you simply don't import/register the child element, or you assert against the child custom-element tag without caring about its internals (see `orders-page.spec.ts`, which checks `app-data-table`'s props without rendering its internals deeply).

### `html`

Tagged template producing a Lit `TemplateResult`. Use `.prop=${value}` to bind **properties** (objects, arrays, functions) and `attr=${value}` for attributes.

```ts
html`<app-data-table .rows=${rows} .columns=${columns}></app-data-table>`;
```

> **The `.` prefix is the key difference from Vue.** In a Vue template `<DataTable :rows="rows" />` always passes a JS value. In Lit's `html`, `rows=${x}` sets an **attribute** (stringified!) while `.rows=${x}` sets the **property** (real object). For arrays/objects/functions you almost always want the dot.

### `fixture(template)` → `Promise<Element>`

IMPORTANT const dataTable = await fixture(html`<app-data-table .rows=${rows} .columns=${columns}></app-data-table>`)

dataTable.rows = newRows
await dataTable.updateComplete;

// dataTable is updated

Mounts the element into the DOM and **awaits its first render** (`updateComplete`). Auto-removed after each test. Always `await` it.

```ts
const el = await fixture(html`<app-orders-page></app-orders-page>`);
```

> **VTU equivalent:** `const wrapper = mount(OrdersPage)`. Difference: `mount` is synchronous and you await `nextTick` later; `fixture` is async and the first render is **already done** when the promise resolves — no initial `await nextTick()` needed.

### Other fixture helpers

| Function                                        | Use                                      | VTU analogue                                                |
| ----------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------- | ------------------------- |
| IMPORTANT                                       | `fixture<T>(tpl)`                        | Typed: `await fixture<AppDataTable>(...)` gives typed `el`. | `mount<typeof Comp>(...)` |
| `fixtureSync(tpl)`                              | Mounts **without** waiting for render.   | `mount` (sync) + manual `nextTick`                          |
| `fixtureCleanup()`                              | Manual teardown (normally automatic).    | `wrapper.unmount()`                                         |
| IMPORTANT                                       | `html`                                   | Build the template.                                         | Vue SFC `<template>`      |
| `unsafeStatic` / `litFixture` / `legacyFixture` | Lower-level / advanced fixture builders. | —                                                           |

### Waiting for updates — `el.updateComplete`

Lit batches renders. After changing a property or firing an event, `await el.updateComplete` before asserting on the new DOM.

IMPORTANT

```ts
table.dispatchEvent(new CustomEvent("page-change", { detail: { page: 3 } }));
await Promise.resolve(); // let the event handler microtask run
await el.updateComplete; // let Lit re-render
```

> **VTU equivalent:** `await wrapper.vm.$nextTick()` or `await nextTick()`. `el.updateComplete` is the Lit property that resolves when the pending render is flushed. The `await Promise.resolve()` step mirrors VTU's `await flushPromises()` for draining microtasks (e.g. a store action) before the render tick.

---

## 4. Querying the DOM — `find` / `findAll` replacement

Web components render into a **shadow root** — query through `el.shadowRoot`, not `el` directly. This is the biggest day-to-day difference from VTU's `wrapper.find`.

| Vue Test Utils                       | @open-wc / DOM                                       |
| ------------------------------------ | ---------------------------------------------------- |
| `wrapper.find("th")`                 | `el.shadowRoot!.querySelector("th")`                 |
| `wrapper.findAll("tbody tr")`        | `el.shadowRoot!.querySelectorAll("tbody tr")`        |
| `wrapper.get("th")` (throws if none) | `el.shadowRoot!.querySelector("th")!` (`!` asserts)  |
| `wrapper.findComponent(Child)`       | `el.shadowRoot!.querySelector("child-el")`           |
| `wrapper.text()`                     | `el.shadowRoot!.textContent`                         |
| `wrapper.html()`                     | `el.shadowRoot!.innerHTML` / `el.outerHTML`          |
| `wrapper.find(...).exists()`         | `expect(el.shadowRoot!.querySelector(...)).to.exist` |
| `wrapper.findAll(...).length`        | `...querySelectorAll(...).length`                    |

```ts
el.shadowRoot!.querySelector("app-data-table"); // first match
el.shadowRoot!.querySelectorAll("tbody tr"); // NodeList of all
el.shadowRoot?.textContent; // all rendered text
[...el.shadowRoot!.querySelectorAll("button")]; // spread to array → .find/.filter/.map
```

> **Key gotcha:** `querySelectorAll` returns a **NodeList**, not an array. To use `.find()/.filter()/.map()` (like VTU's `findAll` results) you must spread it: `[...el.shadowRoot!.querySelectorAll(...)]`.

Common pattern — find by text (VTU has no built-in text filter either):

```ts
const buttons = [...el.shadowRoot!.querySelectorAll("button")];
const page2 = buttons.find((b) => b.textContent?.trim() === "2")!;
```

### Reading props/attributes/classes off the rendered element

IMPORTANT

<button label="btn for submit" >

| Vue Test Utils              | Lit / DOM                                     |
| --------------------------- | --------------------------------------------- |
| `wrapper.props("rows")`     | `el.rows` (read the property)                 |
| `wrapper.attributes("id")`  | `el.getAttribute("id")`                       |
| `wrapper.classes()`         | `[...el.classList]`                           |
| `wrapper.classes("active")` | `el.classList.contains("active")`             |
| `wrapper.vm`                | `el` itself (the element **is** the instance) |
| `(input).element.value`     | `(input as HTMLInputElement).value`           |

In `orders-page.spec.ts` we read a child component's props directly off the element — the VTU `findComponent(...).props()` pattern becomes a plain property read:

```ts
const table = el.shadowRoot?.querySelector("app-data-table") as any;
expect(table.rows).to.have.length(1); // VTU: table.props("rows")
expect(table.page).to.equal(1);
```

---

## 5. Events — `emitted()` / `trigger()` replacement

This is where Lit and Vue diverge most. Vue records emits for you (`wrapper.emitted()`); with Web Components you listen for **real DOM `CustomEvent`s**.

| Vue Test Utils                                  | @open-wc / DOM                                               |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `await wrapper.trigger("click")`                | `el.click()` (then `await el.updateComplete` if needed)      |
| `await wrapper.find("button").trigger("click")` | `button.click()`                                             |
| `wrapper.emitted("row-click")`                  | `await oneEvent(el, "row-click")` _or_ a listener spy        |
| `wrapper.emitted("row-click")[0][0]`            | `event.detail` (payload lives on `CustomEvent.detail`)       |
| `await wrapper.setValue("x")` on an input       | `input.value = "x"; input.dispatchEvent(new Event("input"))` |

### `oneEvent(el, eventName)` → `Promise<Event>`

Waits for one event to fire. Trigger the action **inside a `setTimeout`** so the listener is attached before the event fires, then `await`.

```ts
setTimeout(() => row.click());
const event = await oneEvent(el, "row-click");
expect(event.detail.row).to.deep.equal(rows[0]);
```

> **VTU equivalent:**
>
> ```ts
> await wrapper.find("tbody tr").trigger("click");
> expect(wrapper.emitted("row-click")![0][0]).toEqual({ row: rows[0] });
> ```
>
> Vue buffers emits so you read them _after_ the fact; `oneEvent` is a promise you must arm _before_ the event — hence the `setTimeout` to defer the click until the listener is wired.

### Dispatching events manually

Used when you simulate a child emitting up to a parent (VTU: `child.vm.$emit("page-change", 3)`):

```ts
table.dispatchEvent(
  new CustomEvent("page-change", {
    detail: { page: 3 },
    bubbles: true,
    composed: true, // required to cross shadow DOM boundary
  }),
);
```

> **`composed: true` has no Vue analogue** — Vue events don't deal with shadow boundaries. Omit it and a parent listening outside the shadow root will never hear the event.

### `el.addEventListener` + spy

For asserting an event did/didn't fire (VTU: assert `wrapper.emitted("x")` is `undefined`):

```ts
const rowSpy = vi.fn();
el.addEventListener("row-click", rowSpy);
button.click();
expect(rowSpy.mock.calls).to.have.length(0); // VTU: expect(wrapper.emitted("row-click")).toBeUndefined()
```

### Simulating user interaction

- `element.click()` — native click. (VTU: `.trigger("click")`)
- Typing: set `input.value = "x"` then `input.dispatchEvent(new Event("input"))`. (VTU: `.setValue("x")`)
- Keyboard: `el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))`. (VTU: `.trigger("keydown.enter")`)
- `@open-wc/testing` also re-exports timing helpers: `aTimeout(ms)`, `nextFrame()`, `waitUntil(predicate, message?, { interval, timeout })`. (VTU analogue: `flushPromises()` / `nextTick()`.)

---

## 6. Mocking & spying (Vitest `vi`)

> **Identical to Vue.** `vi` is part of Vitest, so every mocking API here is exactly what you'd use in a Vue test. The only Vue-specific things that disappear are `global.mocks` / `global.stubs` (Vue plugin injection), replaced by plain `vi.mock` of modules/stores.

### `vi.fn(impl?)`

Creates a mock function. Inspect via `.mock`.

```ts
const spy = vi.fn();
button.click();
expect(spy.mock.calls).to.have.length(1); // called once
expect(spy.mock.calls[0][0]).to.deep.equal(rows[0]); // first call, first arg
```

### `vi.spyOn(object, "method")`

Wraps an existing method — track calls while optionally replacing behavior.

```ts
vi.spyOn(ordersStore, "getOrders").mockResolvedValue(undefined);
// later:
expect(
  (ordersStore.getOrders as ReturnType<typeof vi.spyOn>).mock.calls,
).to.have.length(1);
```

> **VTU note:** Where a Vue test mocks Vuex/Pinia via `createTestingPinia()` or `global.plugins`, here we spy directly on the plain singleton store object (`ordersStore`). Simpler — no plugin layer.

### Configuring mock return values

| Method                        | Effect                                 |
| ----------------------------- | -------------------------------------- |
| `.mockReturnValue(v)`         | Return `v` every call.                 |
| `.mockReturnValueOnce(v)`     | Return `v` only next call (queueable). |
| `.mockResolvedValue(v)`       | Return `Promise.resolve(v)`.           |
| `.mockResolvedValueOnce(v)`   | Resolve `v` for one call.              |
| `.mockRejectedValue(e)`       | Return `Promise.reject(e)`.            |
| `.mockRejectedValueOnce(e)`   | Reject for one call.                   |
| `.mockImplementation(fn)`     | Replace with `fn`.                     |
| `.mockImplementationOnce(fn)` | Replace for one call.                  |
| `.mockReturnThis()`           | Return `this` (chainable APIs).        |
| `.mockName("label")`          | Name the mock in error output.         |

### Inspecting a mock — `.mock`

| Property                    | Contains                                                   |
| --------------------------- | ---------------------------------------------------------- |
| `.mock.calls`               | Array of arg-arrays, one per call. `.length` = call count. |
| `.mock.calls[0][1]`         | 1st call's 2nd argument.                                   |
| `.mock.results`             | Return values / thrown errors per call.                    |
| `.mock.lastCall`            | Args of the most recent call.                              |
| `.mock.instances`           | `this` for each call.                                      |
| `.mock.invocationCallOrder` | Global call ordering across mocks.                         |

> **Jest-`expect` shortcuts you _could_ use** (but we assert via Chai on `.mock.calls`): `toHaveBeenCalled`, `toHaveBeenCalledTimes(n)`, `toHaveBeenCalledWith(...)`, `toHaveBeenLastCalledWith(...)`. Since our `expect` is Chai, we instead write `expect(fn.mock.calls).to.have.length(n)` and `expect(fn.mock.calls[0][0]).to.deep.equal(...)`.

### Resetting mocks

| Method                 | Effect                                                          |
| ---------------------- | --------------------------------------------------------------- |
| `vi.clearAllMocks()`   | Clear `.mock.calls`/`results`, keep implementations.            |
| `vi.resetAllMocks()`   | Clear + reset implementations to no-op.                         |
| `vi.restoreAllMocks()` | Restore original methods from `spyOn` — **use in `afterEach`**. |

### Module mocking

```ts
vi.mock("../stores/orders.store", () => ({
  ordersStore: { getOrders: vi.fn(), state: { orders: [] } },
}));
vi.mock("./real", async (orig) => ({ ...(await orig()), foo: vi.fn() })); // partial
vi.unmock("../stores/orders.store");
```

### Timers

> **Identical to Vue.**

```ts
vi.useFakeTimers();
vi.advanceTimersByTime(1000); // tick forward
vi.runAllTimers(); // flush all pending timers
vi.runOnlyPendingTimers(); // flush currently-queued only
vi.useRealTimers(); // restore (do in afterEach)
```

---

## 7. Assertions — Chai (`expect` from @open-wc/testing)

> **This is the biggest API-surface difference from a typical Vue test.** VTU tutorials use Vitest's **Jest-style** `expect` (`.toBe`, `.toEqual`, `.toContain`). We use **Chai-style** from `@open-wc`. The table below is your translation key; the rest of the section is the full Chai reference.

| Jest-style (Vue/Vitest)          | Chai-style (this project)          |
| -------------------------------- | ---------------------------------- |
| `expect(a).toBe(b)`              | `expect(a).to.equal(b)`            |
| `expect(a).toEqual(b)`           | `expect(a).to.deep.equal(b)`       |
| `expect(a).not.toBe(b)`          | `expect(a).to.not.equal(b)`        |
| `expect(x).toBeTruthy()`         | `expect(x).to.be.ok`               |
| `expect(x).toBeNull()`           | `expect(x).to.be.null`             |
| `expect(x).toBeDefined()`        | `expect(x).to.exist`               |
| `expect(arr).toHaveLength(2)`    | `expect(arr).to.have.length(2)`    |
| `expect(s).toContain("x")`       | `expect(s).to.contain("x")`        |
| `expect(s).toMatch(/x/)`         | `expect(s).to.match(/x/)`          |
| `expect(o).toHaveProperty("id")` | `expect(o).to.have.property("id")` |
| `expect(fn).toThrow()`           | `expect(fn).to.throw()`            |
| `expect(x).toBeInstanceOf(T)`    | `expect(x).to.be.an.instanceof(T)` |

`.to`, `.be`, `.have`, `.is`, `.that` are chainable connector words (no-ops for readability). Mix freely.

### Equality

```ts
expect(value).to.equal(3); // === strict   (Jest: toBe)
expect(obj).to.deep.equal({ a: 1 }); // structural   (Jest: toEqual)
expect(obj).to.eql({ a: 1 }); // alias for deep.equal
expect(value).to.not.equal(4); // negate with .not
```

### Truthiness / existence

```ts
expect(el).to.exist; // not null/undefined   (Jest: toBeDefined/not.toBeNull)
expect(value).to.be.true; // (Jest: toBe(true))
expect(value).to.be.false;
expect(value).to.be.null; // (Jest: toBeNull)
expect(value).to.be.undefined; // (Jest: toBeUndefined)
expect(value).to.be.ok; // truthy   (Jest: toBeTruthy)
expect(value).to.be.NaN;
```

### Numbers

```ts
expect(n).to.be.above(5); // > (alias .greaterThan)   (Jest: toBeGreaterThan)
expect(n).to.be.below(10); // < (alias .lessThan)     (Jest: toBeLessThan)
expect(n).to.be.at.least(5); // >=
expect(n).to.be.at.most(10); // <=
expect(n).to.be.within(1, 10); // range
expect(n).to.be.closeTo(3.14, 0.01); // float tolerance   (Jest: toBeCloseTo)
```

### Strings & collections

```ts
expect(text).to.contain("Orders"); // substring OR array membership   (Jest: toContain)
expect(text).to.not.contain("Showing");
expect(text).to.match(/order \d+/i); // regex   (Jest: toMatch)
expect(arr).to.have.length(2); // .length / .lengthOf   (Jest: toHaveLength)
expect(arr).to.include(item); // membership
expect(arr).to.have.members([1, 2]); // same elements (any order)
expect(obj).to.have.property("id"); // (Jest: toHaveProperty)
expect(obj).to.have.property("id", "1"); // property + value
expect(obj).to.have.keys("id", "name");
expect(obj).to.be.empty; // [], {}, ""
```

### Types & instances

```ts
expect(value).to.be.a("string"); // typeof check ("number", "object"...)
expect(value).to.be.an("array");
expect(el).to.be.an.instanceof(HTMLElement); // (Jest: toBeInstanceOf)
```

### Errors

```ts
expect(() => fn()).to.throw(); // (Jest: toThrow())
expect(() => fn()).to.throw(TypeError);
expect(() => fn()).to.throw("specific message");
expect(() => fn()).to.not.throw();
```

### Async (Chai-as-promised, bundled in @open-wc)

```ts
await expect(promise).to.eventually.equal(42);
await expect(promise).to.be.rejected; // (Jest: await expect(p).rejects.toThrow())
await expect(promise).to.be.rejectedWith("boom");
await expect(promise).to.be.fulfilled;
```

---

## 8. Accessibility & snapshots (@open-wc/testing extras)

> **No VTU equivalent for a11y.** Vue Test Utils has no built-in axe integration — you'd add `jest-axe` manually. `@open-wc` ships it. Snapshots, by contrast, map to VTU: `expect(wrapper.html()).toMatchSnapshot()`.

### a11y audit (axe-core)

```ts
const el = await fixture(html`<app-data-table></app-data-table>`);
await expect(el).to.be.accessible(); // passes axe
await expect(el).not.to.be.accessible(); // expect violations
await expect(el).to.be.accessible({ ignoredRules: ["color-contrast"] });
```

### DOM snapshots

| Vue Test Utils                             | @open-wc/testing                                |
| ------------------------------------------ | ----------------------------------------------- |
| `expect(wrapper.html()).toMatchSnapshot()` | `await expect(el).shadowDom.to.equalSnapshot()` |
| `expect(wrapper.html()).toBe("<div>…")`    | `expect(el).dom.to.equal("<x-el></x-el>")`      |

```ts
expect(el).dom.to.equal("<app-data-table></app-data-table>"); // light DOM
expect(el).shadowDom.to.equal("<table>...</table>"); // shadow DOM (no Vue analogue — Vue has no shadow DOM)
await expect(el).shadowDom.to.equalSnapshot(); // saved snapshot file
await expect(el).dom.to.equalSnapshot();
```

---

## 9. Running tests (npm scripts)

> **Identical to Vue** — these are Vitest scripts, component-library-agnostic.

| Command            | Action                                            |
| ------------------ | ------------------------------------------------- |
| `npm test`         | Watch mode (`vitest`).                            |
| `npm run test:run` | Single run, CI-friendly (`vitest run`).           |
| `npm run coverage` | Single run with v8 coverage report (text + html). |

Useful CLI flags:

```bash
npx vitest run path/to/file.spec.ts        # one file
npx vitest run -t "renders headers"        # tests matching name
npx vitest --ui                            # browser UI
npx vitest run --coverage                  # coverage on demand
```

Test files are discovered by the `*.spec.ts` / `*.test.ts` suffix. Place them next to the unit under test (project convention — e.g. `app-data-table.ts` ↔ `app-data-tabe.spec.ts`).

---

## 10. Full worked example — side by side

The same component test, written once in **this project's stack** and once in **Vue Test Utils**, so the mapping is concrete.

### This project (Lit + @open-wc/testing)

```ts
import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import { vi, describe, beforeEach, afterEach, it } from "vitest";

import "./app-data-table"; // register the custom element
import { ordersStore } from "../stores/orders.store";

describe("app-data-table", () => {
  const rows = [{ id: 1, name: "John", email: "john@test.com" }];
  const columns = [{ key: "name", label: "Name" }];

  beforeEach(() => {
    vi.spyOn(ordersStore, "getOrders").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders rows", async () => {
    const el = await fixture(html`
      <app-data-table .rows=${rows} .columns=${columns}></app-data-table>
    `);

    expect(el.shadowRoot!.querySelectorAll("tbody tr")).to.have.length(1);
  });

  it("emits row-click with the row payload", async () => {
    const el = await fixture(html`
      <app-data-table .rows=${rows} .columns=${columns}></app-data-table>
    `);
    const row = el.shadowRoot!.querySelector("tbody tr")!;

    setTimeout(() => row.click()); // arm before oneEvent
    const event = await oneEvent(el, "row-click");

    expect(event.detail.row).to.deep.equal(rows[0]);
  });

  it("re-renders after a property change", async () => {
    const el = await fixture<any>(html`
      <app-data-table .rows=${rows} .columns=${columns}></app-data-table>
    `);

    el.rows = []; // mutate property
    await el.updateComplete; // wait for Lit to re-render

    expect(el.shadowRoot!.textContent).to.contain("No data found");
  });
});
```

### The same test in Vue Test Utils (for comparison)

```ts
import { mount } from "@vue/test-utils";
import { vi, describe, beforeEach, afterEach, it, expect } from "vitest";

import DataTable from "./DataTable.vue";
import { useOrdersStore } from "../stores/orders";

describe("DataTable", () => {
  const rows = [{ id: 1, name: "John", email: "john@test.com" }];
  const columns = [{ key: "name", label: "Name" }];

  beforeEach(() => {
    vi.spyOn(useOrdersStore(), "getOrders").mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders rows", () => {
    const wrapper = mount(DataTable, { props: { rows, columns } });

    expect(wrapper.findAll("tbody tr")).toHaveLength(1);
  });

  it("emits row-click with the row payload", async () => {
    const wrapper = mount(DataTable, { props: { rows, columns } });

    await wrapper.find("tbody tr").trigger("click");

    expect(wrapper.emitted("row-click")![0][0]).toEqual({ row: rows[0] });
  });

  it("re-renders after a prop change", async () => {
    const wrapper = mount(DataTable, { props: { rows, columns } });

    await wrapper.setProps({ rows: [] }); // mutate + wait, in one call

    expect(wrapper.text()).toContain("No data found");
  });
});
```

**What changed, line for line:**

| Step          | Lit + @open-wc                                | Vue Test Utils                         |
| ------------- | --------------------------------------------- | -------------------------------------- |
| Mount         | `await fixture(html\`…\`)`                    | `mount(Comp, { props })`               |
| Pass props    | `.rows=${rows}` in template                   | `props: { rows }` option               |
| Query DOM     | `el.shadowRoot!.querySelectorAll(...)`        | `wrapper.findAll(...)`                 |
| Length assert | `.to.have.length(1)`                          | `.toHaveLength(1)`                     |
| Trigger click | `row.click()` (armed via `setTimeout`)        | `await wrapper.trigger("click")`       |
| Read emitted  | `await oneEvent(el, "row-click")` → `.detail` | `wrapper.emitted("row-click")[0][0]`   |
| Change prop   | `el.rows = []; await el.updateComplete`       | `await wrapper.setProps({ rows: [] })` |
| Text assert   | `.shadowRoot!.textContent` `.to.contain(...)` | `wrapper.text()` `.toContain(...)`     |

---

## Quick cheat-sheet (Lit ↔ Vue)

| Need                | Lit + @open-wc                                                          | Vue Test Utils                        |
| ------------------- | ----------------------------------------------------------------------- | ------------------------------------- |
| Mount component     | `await fixture(html\`<x-el .p=${v}></x-el>\`)`                          | `mount(Comp, { props: { p: v } })`    |
| Wait for re-render  | `await el.updateComplete`                                               | `await nextTick()`                    |
| Drain promises      | `await Promise.resolve()` / `await nextFrame()`                         | `await flushPromises()`               |
| Query rendered DOM  | `el.shadowRoot!.querySelector(...)`                                     | `wrapper.find(...)`                   |
| Query all           | `[...el.shadowRoot!.querySelectorAll(...)]`                             | `wrapper.findAll(...)`                |
| Get text            | `el.shadowRoot!.textContent`                                            | `wrapper.text()`                      |
| Read child props    | `(el.shadowRoot!.querySelector("child") as any).prop`                   | `findComponent(Child).props("prop")`  |
| Wait for an event   | `setTimeout(() => act()); await oneEvent(el, "name")`                   | `wrapper.emitted("name")`             |
| Fire a custom event | `el.dispatchEvent(new CustomEvent("n", { detail, bubbles, composed }))` | `child.vm.$emit("n", payload)`        |
| Click               | `el.click()`                                                            | `await wrapper.trigger("click")`      |
| Set input value     | `input.value="x"; input.dispatchEvent(new Event("input"))`              | `await wrapper.setValue("x")`         |
| Change a prop       | `el.p = v; await el.updateComplete`                                     | `await wrapper.setProps({ p: v })`    |
| Mock a function     | `const fn = vi.fn()`                                                    | `const fn = vi.fn()` (same)           |
| Spy on a method     | `vi.spyOn(obj, "m").mockResolvedValue(...)`                             | `vi.spyOn(obj, "m")...` (same)        |
| Assert call count   | `expect(fn.mock.calls).to.have.length(1)`                               | `expect(fn).toHaveBeenCalledTimes(1)` |
| Restore mocks       | `afterEach(() => vi.restoreAllMocks())`                                 | same                                  |
| Strict equal        | `expect(a).to.equal(b)`                                                 | `expect(a).toBe(b)`                   |
| Deep equal          | `expect(a).to.deep.equal(b)`                                            | `expect(a).toEqual(b)`                |
| Contains text       | `expect(text).to.contain("...")`                                        | `expect(text).toContain("...")`       |
| Exists              | `expect(el).to.exist`                                                   | `expect(wrapper.exists()).toBe(true)` |
| Accessibility       | `await expect(el).to.be.accessible()`                                   | _(no built-in; add jest-axe)_         |
