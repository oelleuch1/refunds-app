/**
 * CUSTOMER SEARCH — step 6
 * - @state query + field ('all' | 'name' | 'email' | 'id')
 * - Bind input; Search button + Enter trigger search
 * - Filter chips set field + active style
 * - dispatchEvent('search', { detail: { query, field } })
 */
import { html, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { tailwindStyles } from "@styles/tailwind-styles";
import { Search, User, Mail, Hash, Box } from "lucide";
import "@shared/presentation/components/app-icon";

@customElement("customer-search-bar")
export class CustomerSearchBar extends LitElement {
  @state()
  private query = "";

  @state()
  private selectedMethod: string = "all";

  static styles = [tailwindStyles];

  private onInput(e: Event) {
    this.query = e?.target?.value ?? '';
    this.emit();
  }

  private updateMethod(method: string) {
    this.selectedMethod = method;
    this.emit();
  }

  private emit() {
    this.dispatchEvent(
      new CustomEvent("search", {
        detail: { query: this.query, column: this.selectedMethod },
      }),
    );
  }

  protected render() {
    return html`
      <div
        class="bg-surface-panel/40 border border-white/5 rounded-2xl p-6 mb-8 shadow-sm"
      >
        <div class="flex gap-3 mb-6">
          <div class="relative flex-1 group">
            <div
              class="absolute inset-y-0 left-4 flex items-center pointer-events-none text-text-dim group-focus-within:text-brand-light transition-colors"
            >
              <app-icon .icon=${Search} .size=${18}></app-icon>
            </div>
            <input
              @input=${this.onInput}
              .value=${this.query}
              type="text"
              placeholder="laurent"
              class="w-full bg-surface-card border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-text-primary placeholder:text-text-dim/50 focus:outline-none focus:border-brand-light/30 focus:bg-surface-card/60 transition-all"
            />
          </div>
          <button
            @click=${this.emit}
            class="bg-brand hover:bg-brand-dark text-white px-6 py-3.5 rounded-xl flex items-center gap-2 font-semibold shadow-brand transition-all active:scale-95"
          >
            <app-icon .icon=${Search} .size=${18} stroke-width="2.5"></app-icon>
            Search
          </button>
        </div>

        <div class="flex flex-wrap gap-3">
          <button
            class="flex items-center gap-2 px-4 py-2 rounded-full bg-brand/15 border border-brand/30 text-brand-light text-sm font-medium transition-colors"
            @click=${() => this.updateMethod("all")} *
          >
            <app-icon .icon=${Search} .size=${14}></app-icon>
            All
          </button>

          <button
            class="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-card border border-white/5 text-text-secondary text-sm font-medium hover:bg-white/5 transition-colors"
            @click=${() => this.updateMethod("name")} 
          >
            <app-icon .icon=${User} .size=${14}></app-icon>
            By name
          </button>

          <button
            class="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-card border border-white/5 text-text-secondary text-sm font-medium hover:bg-white/5 transition-colors"
            @click=${() => this.updateMethod("email")} 
          >
            <app-icon .icon=${Mail} .size=${14}></app-icon>
            By email
          </button>

          <button
            class="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-card border border-white/5 text-text-secondary text-sm font-medium hover:bg-white/5 transition-colors"
            @click=${() => this.updateMethod("id")}
          >
            <app-icon .icon=${Hash} .size=${14}></app-icon>
            By customer ID
          </button>
        </div>
      </div>
    `;
  }
}
