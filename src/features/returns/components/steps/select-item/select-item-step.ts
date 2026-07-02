import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { tailwindStyles } from "@styles/tailwind-styles";
import "./return-item-card";
import type { ReturnItem } from "../../../stores/returns-new.store";

@customElement("select-item-step")
export class SelectItemStep extends LitElement {
  static styles = [tailwindStyles];

  @property({ attribute: false })
  items: ReturnItem[] = [];

  /** itemId -> quantity to return. Presence of a key means the item is selected. */
  @property({ attribute: false })
  selections: Record<string, number> = {};

  protected render() {
    return html`
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Select an item to return</h2>

        <div class="grid gap-3 mt-4">
          ${this.items.length === 0
            ? html`<p class="text-sm text-muted-foreground">
                No items found for this order.
              </p>`
            : this.items.map(
                (item) => html`
                  <return-item-card
                    .item=${item}
                    ?selected=${item.id in this.selections}
                    .quantity=${this.selections[item.id] ?? 1}
                  ></return-item-card>
                `,
              )}
        </div>
      </div>
    `;
  }
}
