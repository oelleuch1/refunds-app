import { tailwindStyles } from "@styles/tailwind-styles";
import { html, LitElement, type TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { type IconNode, ChevronLeft, ChevronRight } from "lucide";

import "@shared/presentation/components/app-icon";

export type DataTableColumn<T> = {
  key: keyof T | string;
  label: string;
  class?: string;
  render?: (row: T) => unknown;
};

export type DataTableAction<T> = {
  label: string;
  icon: IconNode;
  onClick: (row: T) => void;
};

@customElement("app-data-table")
export class AppDataTable<
  T extends Record<string, unknown>,
> extends LitElement {
  static styles = [tailwindStyles];

  @property({ type: Array })
  rows: T[] = [];

  @property({ type: Array })
  columns: DataTableColumn<T>[] = [];

  @property({ type: Array })
  actions: DataTableAction<T>[] = [];

  @property({ type: Boolean })
  loading = false;

  @property({ type: Number })
  page = 1;

  @property({ type: Number })
  total = 0;

  @property({ type: Number })
  pageSize = 10;

  private emitRowClick(row: T) {
    this.dispatchEvent(
      new CustomEvent("row-click", {
        detail: { row },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private emitPageChange(page: number) {
    this.dispatchEvent(
      new CustomEvent("page-change", {
        detail: { page },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected render() {
    return html`
      <div
        class="bg-surface-panel/40 border border-white/5 rounded-2xl overflow-hidden shadow-sm backdrop-blur-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full border-collapse min-w-[720px]">
            <thead class="bg-surface-card/30">
              <tr class="border-b border-white/5">
                ${this.columns.map(
                  (column) => html`
                    <th
                      class="
                        px-6 py-4
                        text-left
                        text-[0.7rem]
                        font-bold
                        uppercase
                        tracking-wider
                        text-text-dim
                        whitespace-nowrap
                        ${column.class ?? ""}
                      "
                    >
                      ${column.label}
                    </th>
                  `,
                )}
                ${this.actions.length > 0
                  ? html`
                      <th
                        class="
                          px-6 py-4
                          text-right
                          text-[0.7rem]
                          font-bold
                          uppercase
                          tracking-wider
                          text-text-dim
                        "
                      >
                        Actions
                      </th>
                    `
                  : ""}
              </tr>
            </thead>

            <tbody class="divide-y divide-white/5">
              ${this.loading
                ? this.renderLoading()
                : this.rows.length === 0
                  ? this.renderEmpty()
                  : this.rows.map((row) => this.renderRow(row))}
            </tbody>
          </table>
        </div>

        <slot name="pagination">
          <div>${this.renderPagination()}</div>
        </slot>
      </div>
    `;
  }

  private renderRow(row: T): TemplateResult {
    return html`
      <tr
        @click=${() => this.emitRowClick(row)}
        class="
          group
          transition-colors
          hover:bg-white/[0.025]
          cursor-pointer
        "
      >
        ${this.columns.map(
          (column) => html`
            <td
              class="
                px-6 py-4
                text-sm
                text-text-secondary
                whitespace-nowrap
                ${column.class ?? ""}
              "
            >
              ${column.render
                ? column.render(row)
                : html`
                    <span class="text-text-primary">
                      ${String(row[column.key] ?? "-")}
                    </span>
                  `}
            </td>
          `,
        )}
        ${this.actions.length > 0
          ? html`
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-2">
                  ${this.actions.map(
                    (action) => html`
                      <button
                        @click=${(e: Event) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                        .title=${action.label}
                        class="
                          h-9 w-9
                          flex items-center justify-center
                          rounded-xl
                          border border-white/5
                          bg-white/[0.02]
                          text-text-dim
                          transition-all
                          hover:bg-white/[0.06]
                          hover:text-text-primary
                          hover:border-white/10
                        "
                      >
                        <app-icon .icon=${action.icon} .size=${16}></app-icon>
                      </button>
                    `,
                  )}
                </div>
              </td>
            `
          : ""}
      </tr>
    `;
  }

  private renderLoading() {
    return html`
      <tr>
        <td
          colspan=${this.columns.length + (this.actions.length ? 1 : 0)}
          class="py-14 text-center"
        >
          <div class="flex flex-col items-center gap-3 text-text-dim">
            <div
              class="h-6 w-6 rounded-full border-2 border-white/10 border-t-white/60 animate-spin"
            ></div>

            <span class="text-sm">Loading data...</span>
          </div>
        </td>
      </tr>
    `;
  }

  private renderEmpty() {
    return html`
      <tr>
        <td
          colspan=${this.columns.length + (this.actions.length ? 1 : 0)}
          class="py-14 text-center"
        >
          <div class="flex flex-col items-center gap-2">
            <span class="text-sm font-medium text-text-primary">
              No data found
            </span>

            <span class="text-xs text-text-dim">
              There is nothing to display yet.
            </span>
          </div>
        </td>
      </tr>
    `;
  }

  private renderPagination() {
    const totalPages = Math.ceil(this.total / this.pageSize);

    if (totalPages <= 1) return null;

    const start = (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, this.total);

    return html`
      <div
        class="
          flex items-center justify-between
          px-6 py-4
          border-t border-white/5
          bg-surface-card/20
        "
      >
        <div class="text-sm text-text-dim">
          Showing
          <span class="font-semibold text-text-primary"> ${start}-${end} </span>
          of
          <span class="font-semibold text-text-primary"> ${this.total} </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            ?disabled=${this.page === 1}
            @click=${() => this.emitPageChange(this.page - 1)}
            class="
              h-9 w-9
              flex items-center justify-center
              rounded-xl
              border border-white/5
              text-text-dim
              transition-colors
              hover:bg-white/5
              disabled:opacity-30
              disabled:cursor-not-allowed
            "
          >
            <app-icon .icon=${ChevronLeft} .size=${16}></app-icon>
          </button>

          ${Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => html`
              <button
                @click=${() => this.emitPageChange(page)}
                class=${`
                  h-9 min-w-9 px-3
                  rounded-xl
                  text-sm font-semibold
                  transition-all
                  ${
                    page === this.page
                      ? "bg-brand text-white shadow-brand"
                      : `
                        border border-white/5
                        text-text-dim
                        hover:bg-white/5
                      `
                  }
                `}
              >
                ${page}
              </button>
            `,
          )}

          <button
            ?disabled=${this.page === totalPages}
            @click=${() => this.emitPageChange(this.page + 1)}
            class="
              h-9 w-9
              flex items-center justify-center
              rounded-xl
              border border-white/5
              text-text-dim
              transition-colors
              hover:bg-white/5
              disabled:opacity-30
              disabled:cursor-not-allowed
            "
          >
            <app-icon .icon=${ChevronRight} .size=${16}></app-icon>
          </button>
        </div>
      </div>
    `;
  }
}
