import { html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { tailwindStyles } from "@styles/tailwind-styles";
import { ChevronLeft, ChevronRight } from "lucide";
import "@shared/presentation/components/app-icon";

export type AppDataTableColumn<T> = {
  label: string;
  key: keyof T;
  render?: (row: T) => TemplateResult;
};

@customElement("app-data-table")
export class AppDataTable<
  T extends Record<string, unknown>,
> extends LitElement {
  static styles = [tailwindStyles];

  // property({ type: String, Number, Array, Object, Boolean })

  // @property({ type: Object })
  // public selectedOrder: OrderData | null = null;

  @property({ type: Array })
  public rows: T[] = [];

  @property({ type: Array })
  public columns: [] = [];

  @property({ type: Number })
  public totalItems = 0;

  private emitPagination(page: number): void {
    this.dispatchEvent(new CustomEvent("pagination", { detail: { page } }));
  }

  protected render(): TemplateResult {
    return html`
      <div
        class="bg-surface-panel/40 border border-white/5 rounded-2xl overflow-hidden shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-white/5">
                ${this.columns.map(
                  (col) =>
                    html`<th
                      class="px-6 py-4 text-xs font-bold text-text-dim uppercase tracking-wider"
                    >
                      ${col.label}
                    </th>`,
                )}
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${this.rows.map((row) => this.renderRow(row))}
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <slot name="pagination">
          <div
            class="px-6 py-4 flex items-center justify-between border-t border-white/5 bg-surface-card/30"
          >
            <div class="text-sm text-text-dim">
              Showing <span class="text-text-primary font-medium">1–4</span> of
              <span class="text-text-primary font-medium">4</span>
            </div>
            <div class="flex items-center gap-2">
              <button
                class="p-2 rounded-lg border border-white/5 text-text-dim hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                disabled
              >
                <app-icon .icon=${ChevronLeft} .size=${18}></app-icon>
              </button>
              ${Array.from({ length: this.totalItems }).map(
                (_, index) =>
                  html`<button
                    @click=${() => this.emitPagination(index + 1)}
                    class="w-9 h-9 flex items-center justify-center rounded-lg bg-brand text-white text-sm font-bold shadow-brand transition-all"
                  >
                    ${index + 1}
                  </button>`,
              )}
              <button
                class="p-2 rounded-lg border border-white/5 text-text-dim hover:bg-white/5 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                disabled
              >
                <app-icon .icon=${ChevronRight} .size=${18}></app-icon>
              </button>
            </div>
          </div>
        </slot>
      </div>
    `;
  }

  private renderRow(row: T): TemplateResult {
    return html`
      <tr class="hover:bg-white/[0.02] transition-colors group">
        ${this.columns.map((col) => {
          return html`<td
            class="px-6 py-4 text-sm text-text-primary font-medium font-mono"
          >
            ${col.render ? col.render(row) : row[col.key]}
          </td>`;
        })}
      </tr>
    `;
  }
}
