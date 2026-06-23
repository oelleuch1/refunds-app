# Testing Documentation — @web/test-runner + Mocha + Sinon + @open-wc/testing (with Vue Test Utils comparison)

Reference for writing professional unit tests in this project, written for someone who already knows **Vitest + Vue Test Utils** and is mapping that knowledge onto **Lit / Web Components**.

Every section pairs the API we use with its **Vue Test Utils (VTU)** equivalent so you can translate intuition directly.

**Stack:**

- **@web/test-runner** — runs tests in a **real browser** (headless Chromium), not jsdom. More faithful for shadow DOM / custom elements than a simulated DOM. _This replaces the Vitest runner._
- **Mocha** — `describe` / `it` / lifecycle hooks. Wired in by `@web/test-runner-mocha` and exposed as **globals** (no import). _This replaces Vitest's runner half (`describe`/`it`/`beforeEach`)._
- **Sinon** — spies, stubs, fakes, mocks, and fake timers. _This replaces Vitest's `vi`._
- **@open-wc/testing 4** — Lit/Web Component fixtures + **Chai** assertions (`expect(...).to.*`). _This replaces `@vue/test-utils` and supplies the one `expect` we use._

> Mocha + Chai + Sinon is the canonical @open-wc testing stack — `@open-wc/testing` already bundles Chai, so the only thing you import for assertions is its `expect`. Compared to a Vue project, the runner (Mocha vs Vitest) and the mocking lib (Sinon vs `vi`) change; the component-fixture and assertion layers are @open-wc either way.

### The big mental-model shift from Vue

| Concept                | Vue Test Utils                                    | Lit + @open-wc/testing                                   |
| ---------------------- | ------------------------------------------------- | -------------------------------------------------------- |
| Mount a component      | `mount(Component, { props })` → `wrapper`         | `await fixture(html\`<x-el .p=${v}></x-el>\`)` → `Element` |
| The thing you get back | A **wrapper** object (`wrapper.vm`, `.find`…)     | The **real DOM element** (`el.shadowRoot`, `el.prop`)    |
| Where markup lives     | `wrapper.find(...)` (light DOM)                   | `el.shadowRoot!.querySelector(...)` (**shadow** DOM)     |
| Wait for re-render     | `await nextTick()` / `await wrapper.vm.$nextTick` | `await el.updateComplete`                                |
| Assertion style        | Jest-style `expect(x).toBe(y)`                    | Chai-style `expect(x).to.equal(y)`                       |
| Read emitted events    | `wrapper.emitted('name')`                         | `await oneEvent(el, 'name')` or a listener spy           |
| Set a prop after mount | `await wrapper.setProps({ p })`                   | `el.p = v; await el.updateComplete`                      |
| Make a spy/stub        | `vi.fn()` / `vi.spyOn(...)`                        | `sinon.spy()` / `sinon.stub(...)`                        |

The single most common bug when coming from Vue: forgetting that Web Components render into a **shadow root**, so `el.querySelector` finds nothing — you must go through `el.shadowRoot`.

**One `expect`, one mocking library:**

- `expect` comes from `@open-wc/testing` → **Chai** syntax (`.to.equal`, `.to.contain`). This is the only `expect` in the project.
- Spies/stubs come from `sinon`. Chai reads the booleans Sinon exposes (`spy.calledOnce`, `spy.callCount`).
- `describe` / `it` / `beforeEach` / `afterEach` are **Mocha globals** — nothing to import.

```ts
import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import sinon from "sinon";
// describe / it / beforeEach / afterEach are Mocha globals — no import needed
```

> In a Vue project you'd instead write `import { mount } from "@vue/test-utils"` and `import { expect, vi, describe, it } from "vitest"` — one `expect` (Jest-style), `vi` for mocks, and the runner imported from `vitest`.
>
> **TypeScript note:** add `@types/mocha` (so the global `describe`/`it` type-check) and `@types/sinon` to devDependencies.

---

## 1. Test structure (Mocha)

> **Almost identical to Vue.** `describe`/`it` exist in both. The difference is the **modifiers**: Mocha has a smaller set than Vitest — no `it.each`, no `it.todo`, no `it.concurrent`. Parameterization is a plain JS loop.

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

Defines a single test. `it` reads better with behavior names. Return a promise (or use `async`) for async tests — Mocha awaits it.

```ts
it("renders headers", async () => {
  /* ... */
});
```

### Modifiers (Mocha)

| Modifier                         | Purpose                                                          |
| -------------------------------- | --------------------------------------------------------------- |
| `it.only(...)`                   | Run **only** this test (and other `.only`s). Debugging.         |
| `it.skip(...)` / `xit(...)`      | Skip this test.                                                 |
| `it("name")` (no callback)       | **Pending** placeholder (Vitest's `it.todo`).                  |
| `describe.only` / `describe.skip`| Focus / skip an entire suite.                                  |
| `this.timeout(ms)`               | Per-test timeout. Needs a `function()` body — **not** an arrow. |
| `this.retries(n)`                | Retry a flaky test up to `n` times.                            |

> **No `it.each` in Mocha.** Parameterize with an ordinary loop that calls `it` per row (Vitest's `it.each` and `describe.each` have no direct equivalent):

```ts
for (const { input, expected } of [
  { input: 1, expected: "1" },
  { input: 10, expected: "10" },
]) {
  it(`formats ${input} → ${expected}`, () => {
    expect(format(input)).to.equal(expected);
  });
}
```

> **Arrow-function gotcha:** Mocha exposes per-test config through `this` (`this.timeout`, `this.retries`, `this.slow`). Arrow functions don't bind `this`, so if you need those, write `it("…", function () { this.timeout(5000); … })`. For everything else, arrows are fine.

---

## 2. Lifecycle hooks (Mocha)

> **Watch the names.** Mocha calls the once-per-scope hooks `before` / `after` — **not** Vitest's `beforeAll` / `afterAll`. The per-test hooks (`beforeEach` / `afterEach`) match.

| Hook             | Runs                                | Vitest equivalent |
| ---------------- | ----------------------------------- | ----------------- |
| `before(fn)`     | Once before all tests in the scope. | `beforeAll`       |
| `after(fn)`      | Once after all tests in the scope.  | `afterAll`        |
| `beforeEach(fn)` | Before **every** test — fresh state.| `beforeEach`      |
| `afterEach(fn)`  | After **every** test — **`sinon.restore()` here**. | `afterEach` |

Scope follows the `describe` they're declared in. Always restore Sinon in `afterEach` to prevent stub/spy leakage between tests:

```ts
beforeEach(() => {
  sinon.stub(ordersStore, "getOrders").resolves(undefined);
  ordersStore.state = { orders: [], isLoading: false /* ... */ };
});

afterEach(() => {
  sinon.restore(); // restores every fake on the default sandbox
});
```

> **`sinon.restore()` is the workhorse.** The `sinon` object is itself the **default sandbox**, so anything you created with `sinon.spy(obj, …)` / `sinon.stub(obj, …)` is tracked and undone in one call. (Vitest equivalent: `vi.restoreAllMocks()`.)
>
> **VTU note:** In Vue you typically also call `wrapper.unmount()` in `afterEach`. With `@open-wc` the fixture is **auto-removed** after each test, so you rarely need manual teardown (see `fixtureCleanup` in §3).

---

## 3. Component fixtures (@open-wc/testing) — the `mount()` replacement

This is the section that maps directly onto VTU's `mount` / `shallowMount`. **Unchanged** by the move to Mocha/Sinon — fixtures are @open-wc.

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

```ts
const dataTable = await fixture(
  html`<app-data-table .rows=${rows} .columns=${columns}></app-data-table>`,
);

dataTable.rows = newRows;
await dataTable.updateComplete;
// dataTable is now re-rendered
```

Mounts the element into the DOM and **awaits its first render** (`updateComplete`). Auto-removed after each test. Always `await` it.

```ts
const el = await fixture(html`<app-orders-page></app-orders-page>`);
```

> **VTU equivalent:** `const wrapper = mount(OrdersPage)`. Difference: `mount` is synchronous and you await `nextTick` later; `fixture` is async and the first render is **already done** when the promise resolves — no initial `await nextTick()` needed.

### Other fixture helpers

| Function                                        | Use                                      | VTU analogue                       |
| ----------------------------------------------- | ---------------------------------------- | ---------------------------------- |
| `fixture<T>(tpl)`                               | Typed: `await fixture<AppDataTable>(...)` gives a typed `el`. | `mount<typeof Comp>(...)` |
| `fixtureSync(tpl)`                              | Mounts **without** waiting for render.   | `mount` (sync) + manual `nextTick` |
| `fixtureCleanup()`                              | Manual teardown (normally automatic).    | `wrapper.unmount()`                |
| `html`                                          | Build the template.                      | Vue SFC `<template>`               |
| `unsafeStatic` / `litFixture` / `legacyFixture` | Lower-level / advanced fixture builders. | —                                  |

### Waiting for updates — `el.updateComplete`

Lit batches renders. After changing a property or firing an event, `await el.updateComplete` before asserting on the new DOM.

```ts
table.dispatchEvent(new CustomEvent("page-change", { detail: { page: 3 } }));
await Promise.resolve(); // let the event handler microtask run
await el.updateComplete; // let Lit re-render
```

> **VTU equivalent:** `await wrapper.vm.$nextTick()` or `await nextTick()`. `el.updateComplete` is the Lit property that resolves when the pending render is flushed. The `await Promise.resolve()` step mirrors VTU's `await flushPromises()` for draining microtasks (e.g. a store action) before the render tick.

---

## 4. Querying the DOM — `find` / `findAll` replacement

Web components render into a **shadow root** — query through `el.shadowRoot`, not `el` directly. This is the biggest day-to-day difference from VTU's `wrapper.find`. **Unchanged** by Mocha/Sinon.

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

This is where Lit and Vue diverge most. Vue records emits for you (`wrapper.emitted()`); with Web Components you listen for **real DOM `CustomEvent`s**, and you use a **Sinon spy** as the listener.

| Vue Test Utils                                  | @open-wc / DOM + Sinon                                        |
| ----------------------------------------------- | ------------------------------------------------------------ |
| `await wrapper.trigger("click")`                | `el.click()` (then `await el.updateComplete` if needed)      |
| `await wrapper.find("button").trigger("click")` | `button.click()`                                             |
| `wrapper.emitted("row-click")`                  | `await oneEvent(el, "row-click")` _or_ a `sinon.spy()` listener |
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

### `el.addEventListener` + a Sinon spy

For asserting an event did/didn't fire (VTU: assert `wrapper.emitted("x")` is `undefined`):

```ts
const rowSpy = sinon.spy();
el.addEventListener("row-click", rowSpy);
button.click();
expect(rowSpy.called).to.be.false; // VTU: expect(wrapper.emitted("row-click")).toBeUndefined()
```

And to assert it fired **with** a payload:

```ts
const rowSpy = sinon.spy();
el.addEventListener("row-click", rowSpy);
row.click();
expect(rowSpy.calledOnce).to.be.true;
expect(rowSpy.firstCall.args[0].detail.row).to.deep.equal(rows[0]);
```

### Simulating user interaction

- `element.click()` — native click. (VTU: `.trigger("click")`)
- Typing: set `input.value = "x"` then `input.dispatchEvent(new Event("input"))`. (VTU: `.setValue("x")`)
- Keyboard: `el.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }))`. (VTU: `.trigger("keydown.enter")`)
- `@open-wc/testing` also re-exports timing helpers: `aTimeout(ms)`, `nextFrame()`, `waitUntil(predicate, message?, { interval, timeout })`. (VTU analogue: `flushPromises()` / `nextTick()`.)

---

## 6. Mocking & spying (Sinon)

> **This is the section that changed most.** Vitest's `vi` is gone; Sinon provides the same capabilities with a different API. The key distinction Sinon draws that `vi` blurs:
>
> - **spy** — records calls, **keeps the real behavior** (`sinon.spy`).
> - **stub** — records calls **and replaces behavior** (`sinon.stub`), with rich per-call/per-arg configuration.
> - **fake** — a simpler, **immutable** spy+stub combo (`sinon.fake`), the modern recommendation for straightforward cases.
>
> Roughly: `vi.fn()` ≈ `sinon.spy()`/`sinon.fake()`, and `vi.spyOn(obj, "m").mockX(...)` ≈ `sinon.stub(obj, "m").x(...)`.

### Creating test doubles

```ts
const fn = sinon.spy();              // anonymous spy (vi.fn())
const fn = sinon.spy(impl);          // spy that also runs impl
sinon.spy(ordersStore, "getOrders"); // wrap a real method, keep its behavior

const s = sinon.stub();                       // anonymous stub
sinon.stub(ordersStore, "getOrders");         // replace the method (no-op by default)
sinon.stub(ordersStore, "getOrders").resolves(undefined);

const f = sinon.fake.resolves(session); // immutable fake (recommended for simple cases)
sinon.replace(ordersStore, "getOrders", f); // install a fake onto an object (auto-restored)
```

### `vi` → Sinon translation

| Vitest `vi`                              | Sinon                                              |
| ---------------------------------------- | -------------------------------------------------- |
| `vi.fn()`                                | `sinon.spy()` _or_ `sinon.fake()`                  |
| `vi.fn(impl)`                            | `sinon.spy(impl)` _or_ `sinon.fake(impl)`          |
| `vi.spyOn(o, "m")` (observe, keep impl)  | `sinon.spy(o, "m")`                                |
| `vi.spyOn(o, "m").mockReturnValue(v)`    | `sinon.stub(o, "m").returns(v)`                     |
| `vi.spyOn(o, "m").mockResolvedValue(v)`  | `sinon.stub(o, "m").resolves(v)`                   |
| `vi.spyOn(o, "m").mockRejectedValue(e)`  | `sinon.stub(o, "m").rejects(e)`                    |
| `.mockReturnValueOnce(v)`                | `.onCall(0).returns(v)` (or `.onFirstCall()`)      |
| `.mockImplementation(fn)`                | `.callsFake(fn)`                                   |
| `.mockReturnThis()`                      | `.returnsThis()`                                   |

### Configuring stub behavior

| Method                          | Effect                                               |
| ------------------------------- | ---------------------------------------------------- |
| `.returns(v)`                   | Return `v` on every call.                            |
| `.resolves(v)`                  | Return `Promise.resolve(v)`.                         |
| `.rejects(e)`                   | Return `Promise.reject(e)`.                          |
| `.throws(e)`                    | Throw on call.                                       |
| `.returnsThis()`               | Return `this` (chainable APIs).                      |
| `.callsFake(fn)`                | Replace with `fn` (Vitest's `mockImplementation`).   |
| `.onCall(n).returns(v)`         | Behavior for the `n`-th call (0-based).              |
| `.onFirstCall()` / `.onSecondCall()` | Sugar for `.onCall(0)` / `.onCall(1)`.          |
| `.withArgs(x).returns(v)`       | Conditional behavior based on call arguments.        |

```ts
const stub = sinon.stub(ordersStore, "getOrders");
stub.resolves([]); // default
stub.withArgs({ page: 2 }).rejects(new Error("boom")); // arg-conditional
stub.onFirstCall().resolves([order]); // per-call
```

### Inspecting a double — the spy call API

Sinon exposes booleans/arrays directly on the double (no `.mock` namespace like `vi`):

| Sinon                         | Contains / checks                                                 |
| ----------------------------- | ----------------------------------------------------------------- |
| `.callCount`                  | Number of calls (Vitest: `.mock.calls.length`).                  |
| `.called` / `.notCalled`      | Was it called at all.                                            |
| `.calledOnce` / `.calledTwice`| Exactly 1 / 2 calls.                                            |
| `.calledWith(a, b)`           | Was it ever called with these args (subset/`match` allowed).    |
| `.calledWithExactly(a, b)`    | Called with exactly these args, no extras.                      |
| `.args`                       | 2-D array of args, one row per call (Vitest: `.mock.calls`).    |
| `.getCall(n)`                 | The `n`-th call object → `.args`, `.returnValue`, `.exception`, `.thisValue`, `.firstArg`, `.lastArg`. |
| `.firstCall` / `.lastCall`    | First / most recent call objects.                               |
| `.returnValues` / `.thisValues` | Per-call return values / `this` (Vitest: `.mock.results`).    |
| `.threw()`                    | Did any call throw.                                             |

```ts
expect(spy.callCount).to.equal(1); // Vitest: expect(fn.mock.calls).to.have.length(1)
expect(spy.calledWith("agent@example.com", "pw")).to.be.true;
expect(spy.firstCall.args[0]).to.deep.equal(rows[0]); // Vitest: fn.mock.calls[0][0]
```

> **Chai vs `sinon.assert`.** Since our `expect` is Chai, we assert on Sinon's booleans (`expect(spy.calledOnce).to.be.true`). Sinon also ships its own assertions with nicer failure messages — `sinon.assert.calledOnce(spy)`, `sinon.assert.calledWith(spy, arg)`, `sinon.assert.notCalled(spy)`, `sinon.assert.callCount(spy, n)`, `sinon.assert.callOrder(a, b)`. Either is fine; pick one style per file. (The `sinon-chai` plugin merges them into `expect(spy).to.have.been.calledOnce`, but we don't depend on it.)

### Resetting & restoring

| Method                  | Effect                                                                    |
| ----------------------- | ------------------------------------------------------------------------- |
| `spy.resetHistory()`    | Clear recorded calls, keep behavior (Vitest: `clearAllMocks`).            |
| `stub.resetBehavior()`  | Clear configured behavior, keep history.                                  |
| `stub.reset()`          | Clear both history **and** behavior.                                      |
| `sinon.resetHistory()`  | `resetHistory()` on every default-sandbox fake.                          |
| `sinon.reset()`         | Reset history + behavior on every default-sandbox fake (Vitest: `resetAllMocks`). |
| `sinon.restore()`       | **Un-wrap every method** restored to the original — **use in `afterEach`** (Vitest: `restoreAllMocks`). |

### "Module mocking" — the one real gap vs `vi`

Sinon **cannot intercept ES-module imports** the way `vi.mock("…")` does — there is no `sinon.mock("../stores/orders.store")`. Two idiomatic replacements:

1. **Dependency injection** (preferred, and what the use-case specs already do): pass collaborators into the constructor and hand in stubs.

   ```ts
   const repository: IAuthRepository = {
     signIn: sinon.stub().resolves(session),
     signUp: sinon.stub(),
     signOut: sinon.stub(),
     getCurrentSession: sinon.stub(),
   };
   const useCase = new SignInUseCase(repository);
   ```

2. **Stub a method on the imported singleton** — replace behavior on the live object instead of the module:

   ```ts
   import { ordersStore } from "../stores/orders.store";
   sinon.stub(ordersStore, "getOrders").resolves([]);
   ```

> `sinon.mock(obj)` exists, but it's the classic "mock with pre-set expectations" API (`mock.expects("m").once()` + `mock.verify()`) — **not** module interception. For Web Components, DI + method stubs cover essentially every case.

### Fake timers

```ts
const clock = sinon.useFakeTimers(); // (Vitest: vi.useFakeTimers())
clock.tick(1000); // advance 1000ms        (vi.advanceTimersByTime)
clock.next(); // run the next queued timer
clock.runAll(); // flush all pending timers (vi.runAllTimers)
clock.setSystemTime(new Date("2026-01-01")); // pin Date.now()
clock.restore(); // restore real timers      (vi.useRealTimers) — or sinon.restore()
```

---

## 7. Assertions — Chai (`expect` from @open-wc/testing)

> **Unchanged by the runner swap** — assertions were always @open-wc's Chai, not Vitest. VTU tutorials use Vitest's **Jest-style** `expect` (`.toBe`, `.toEqual`, `.toContain`); we use **Chai-style**. The table below is your translation key; the rest is the full Chai reference.

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

## 9. Running tests (@web/test-runner)

> **This replaces the Vitest scripts.** `@web/test-runner` (often invoked as `wtr`) bundles, serves, and runs the specs in a **real browser** via the Mocha framework. TypeScript specs need a transform — `@web/dev-server-esbuild` — wired up in the config.

| Command               | Action                                                  |
| --------------------- | ------------------------------------------------------- |
| `npm test`            | Single run (`web-test-runner`).                         |
| `npm run test:watch`  | Watch mode (`web-test-runner --watch`).                 |
| `npm run coverage`    | Single run with coverage (`web-test-runner --coverage`).|

Suggested `package.json` scripts:

```json
{
  "scripts": {
    "test": "web-test-runner",
    "test:watch": "web-test-runner --watch",
    "coverage": "web-test-runner --coverage"
  }
}
```

Useful CLI flags:

```bash
web-test-runner "src/**/foo.spec.ts"   # specific files (glob)
web-test-runner --watch                # watch; press D to debug in a browser, F to filter files
web-test-runner --coverage             # coverage on demand
web-test-runner --group default        # run a named browser/group from the config
```

Minimal `web-test-runner.config.mjs`:

```js
import { esbuildPlugin } from "@web/dev-server-esbuild";

export default {
  files: "src/**/*.spec.ts", // discovery glob
  nodeResolve: true, // resolve bare module specifiers
  plugins: [esbuildPlugin({ ts: true, target: "es2022" })], // transpile TS specs
  coverage: true,
};
```

> **Devtool deps** for this stack: `@web/test-runner`, `@web/dev-server-esbuild`, `mocha`, `sinon`, `@open-wc/testing`, plus `@types/mocha` and `@types/sinon`. (`mocha` and `chai` come in transitively via `@web/test-runner` / `@open-wc/testing`, but listing them is clearer.)

Test files are discovered by the `*.spec.ts` / `*.test.ts` suffix. Place them next to the unit under test (project convention — e.g. `app-data-table.ts` ↔ `app-data-table.spec.ts`).

---

## 10. Full worked example — side by side

The same component test, written once in **this project's stack** and once in **Vue Test Utils**, so the mapping is concrete.

### This project (Lit + @open-wc/testing + Mocha + Sinon)

```ts
import { fixture, html, expect, oneEvent } from "@open-wc/testing";
import sinon from "sinon";

import "./app-data-table"; // register the custom element
import { ordersStore } from "../stores/orders.store";

describe("app-data-table", () => {
  const rows = [{ id: 1, name: "John", email: "john@test.com" }];
  const columns = [{ key: "name", label: "Name" }];

  beforeEach(() => {
    sinon.stub(ordersStore, "getOrders").resolves(undefined);
  });

  afterEach(() => {
    sinon.restore();
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

  it("invokes the action callback with the row", async () => {
    const onClick = sinon.spy(); // Vitest: vi.fn()
    const el = await fixture(html`
      <app-data-table
        .rows=${rows}
        .columns=${columns}
        .actions=${[{ label: "View", icon: {}, onClick }]}
      ></app-data-table>
    `);

    el.shadowRoot!.querySelector<HTMLButtonElement>("tbody button")!.click();

    expect(onClick.calledOnce).to.be.true; // Vitest: expect(fn).toHaveBeenCalledTimes(1)
    expect(onClick.firstCall.args[0]).to.deep.equal(rows[0]); // Vitest: fn.mock.calls[0][0]
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

  it("invokes the action callback with the row", async () => {
    const onClick = vi.fn();
    const wrapper = mount(DataTable, {
      props: { rows, columns, actions: [{ label: "View", onClick }] },
    });

    await wrapper.find("tbody button").trigger("click");

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toEqual(rows[0]);
  });
});
```

**What changed, line for line:**

| Step          | Lit + @open-wc + Mocha + Sinon                | Vue Test Utils                          |
| ------------- | --------------------------------------------- | --------------------------------------- |
| Mount         | `await fixture(html\`…\`)`                     | `mount(Comp, { props })`                |
| Pass props    | `.rows=${rows}` in template                   | `props: { rows }` option                |
| Query DOM     | `el.shadowRoot!.querySelectorAll(...)`        | `wrapper.findAll(...)`                  |
| Length assert | `.to.have.length(1)`                          | `.toHaveLength(1)`                      |
| Trigger click | `row.click()` (armed via `setTimeout`)        | `await wrapper.trigger("click")`        |
| Read emitted  | `await oneEvent(el, "row-click")` → `.detail` | `wrapper.emitted("row-click")[0][0]`    |
| Change prop   | `el.rows = []; await el.updateComplete`       | `await wrapper.setProps({ rows: [] })`  |
| Make a spy    | `sinon.spy()`                                 | `vi.fn()`                               |
| Stub a method | `sinon.stub(o, "m").resolves(v)`              | `vi.spyOn(o, "m").mockResolvedValue(v)` |
| Assert called | `expect(fn.calledOnce).to.be.true`            | `expect(fn).toHaveBeenCalledTimes(1)`   |
| Restore       | `sinon.restore()`                             | `vi.restoreAllMocks()`                  |

---

## Quick cheat-sheet (Lit + Sinon ↔ Vue + Vitest)

| Need                | Lit + @open-wc + Mocha + Sinon                                          | Vue + Vitest                          |
| ------------------- | ----------------------------------------------------------------------- | ------------------------------------- |
| Mount component     | `await fixture(html\`<x-el .p=${v}></x-el>\`)`                           | `mount(Comp, { props: { p: v } })`    |
| Once-before hook    | `before(...)`                                                           | `beforeAll(...)`                      |
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
| Make a spy          | `const fn = sinon.spy()`                                                | `const fn = vi.fn()`                  |
| Spy on a method     | `sinon.spy(obj, "m")`                                                   | `vi.spyOn(obj, "m")`                  |
| Stub a method       | `sinon.stub(obj, "m").resolves(v)`                                      | `vi.spyOn(obj, "m").mockResolvedValue(v)` |
| Assert call count   | `expect(fn.callCount).to.equal(1)` / `expect(fn.calledOnce).to.be.true`| `expect(fn).toHaveBeenCalledTimes(1)` |
| Assert called with  | `expect(fn.calledWith(x)).to.be.true`                                   | `expect(fn).toHaveBeenCalledWith(x)`  |
| Read call args      | `fn.firstCall.args[0]`                                                  | `fn.mock.calls[0][0]`                 |
| Restore mocks       | `afterEach(() => sinon.restore())`                                      | `afterEach(() => vi.restoreAllMocks())` |
| Fake timers         | `const clock = sinon.useFakeTimers(); clock.tick(ms)`                   | `vi.useFakeTimers(); vi.advanceTimersByTime(ms)` |
| Strict equal        | `expect(a).to.equal(b)`                                                 | `expect(a).toBe(b)`                   |
| Deep equal          | `expect(a).to.deep.equal(b)`                                            | `expect(a).toEqual(b)`                |
| Contains text       | `expect(text).to.contain("...")`                                        | `expect(text).toContain("...")`       |
| Exists              | `expect(el).to.exist`                                                   | `expect(wrapper.exists()).toBe(true)` |
| Accessibility       | `await expect(el).to.be.accessible()`                                   | _(no built-in; add jest-axe)_         |
